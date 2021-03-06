const http = require('http')
const { ApolloServer, UserInputError, gql } = require('apollo-server-express')
const express = require("express")
const path = require("path")
require("dotenv").config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const AWS = require('aws-sdk')
const { PubSub, withFilter } = require('apollo-server')
const pubsub = new PubSub()
const cors = require('cors')



const mongoose = require('mongoose')
const User = require('./schema/user')
const Post = require('./schema/post')
const Comment = require('./schema/comment')
const ChildComment = require('./schema/childComment')
// const messages = []
// messages(channel_name: String!): [Message!]



// if (process.argv.length < 4) {
//   console.log('Please provide the password as an argument: node mongo.js <password> <secret_key>')
//   process.exit(1)
// }

const password = process.env.MONGO_PASSWORD
const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = `mongodb+srv://insdaisy:${password}@cluster0.wtbvi.mongodb.net/insdaisy?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })



const typeDefs = gql`  
    type Message {
        id: ID!
        username: String
        content: String!
        channel_name: String!
        created_at: String
    }

    type Subscription {
        postMessage(channel_name: String!): Message!
    }


    type Token {
        value: String!
        username: String!
        id: ID!
    }

    type File {
        url: String!
    }

    type User {
        username: String!
        avatar: String!
        passwordHash: String!
        friends: [User]!
        posts: [Post]!
        id: ID!
    }

    type Post {
        url: String!
        filter: String!
        title: String!
        updated: String!
        likes: [User]!
        comments: [Comment]!
        user: User!
        id: ID!
    }

    type Comment {
        content: String!
        updated: String!
        likes: [User]!
        user: User
        post: Post
        childComments: [ChildComment]!
        id: ID!
    }

    type ChildComment {
        content: String!
        updated: String!
        likes: [User]!
        user: User
        replyTo: User
        parentComment: Comment
        id: ID!
    }


    type Query {
        allPosts: [Post!]!
        findUser(id: ID): User!
        findPost(id: ID): Post!
    }


    type Mutation {
        postMessage(
            username: String
            content: String!
            channel_name: String!
            created_at: String
        ): Message


        s3PreSign(
            key: String!
            type: String!
        ): File

        addPost(
            url: String!
            filter: String!
            title: String!
            user: ID!
        ): Post

        addPostLikes(
            id: ID!
            likes: [ID]!
        ): Post

        removePostLikes(
            id: ID!
            likes: [ID]!
        ): Post

        addComment(
            content: String!
            user: ID!
            post: ID!
        ): Comment

        addCommentLikes(
            id: ID!
            likes: [ID]!
        ): Comment

        removeCommentLikes(
            id: ID!
            likes: [ID]!
        ): Comment

        addChildComment(
            content: String!
            user: ID!
            replyTo: ID!
            parentComment: ID!
        ): ChildComment
        
        addChildCommentLikes(
            id: ID!
            likes: [ID]!
        ): ChildComment

        removeChildCommentLikes(
            id: ID!
            likes: [ID]!
        ): ChildComment

        createUser(
            username: String!
            avatar: String!
            passwordHash: String!
        ): User

        addFriend(
            id: ID!
            friends: [ID]!
        ): User

        removeFriend(
            id: ID!
            friends: [ID]!
        ): User
        
        login(
            username: String!
            passwordHash: String!
        ): Token
    }
`
  
const resolvers = {
    Query: {
        // messages: (root, args) => messages.filter(message => message.channel_name === args.channel_name),
        allPosts: () => Post.find({}),
        findUser: (root, args) => User.findById(args.id),
        findPost: (root, args) => Post.findById(args.id)
    },
    User: {
        posts(parent) {
            return parent.posts.map(post => Post.findById(post))
        },
        friends(parent) {
            return parent.friends.map(friend => User.findById(friend))
        }
    },
    Post: {
        likes(parent) {
            return parent.likes.map(user => User.findById(user))
        },
        comments(parent) {
            return parent.comments.map(comment => Comment.findById(comment))
        }, 
        user(parent) {
            return User.findById(parent.user)
        },
    },
    Comment: {
        user(parent) {
            return User.findById(parent.user)
        },
        likes(parent) {
            return parent.likes.map(user => User.findById(user))
        },
        post(parent) {
            return Post.findById(parent.post)
        },
        childComments(parent) {
            return parent.childComments.map(child => ChildComment.findById(child))
        }
    },
    ChildComment: {
        user(parent) {
            return User.findById(parent.user)
        },
        replyTo(parent) {
            return User.findById(parent.replyTo)
        },
        likes(parent) {
            return parent.likes.map(user => User.findById(user))
        },
        parentComment(parent) {
            return Comment.findById(parent.parentComment)
        }
    },
    Mutation: {
        s3PreSign: async (root, args) => {  

            const bucket = "daisy-ins"           
            const key = args.key
            const type = args.type
            const timeout = 30

            // AWS Config Here or Shared Config on Windows
            // AWS.config.update({
            //     region: 'REGION',
            //     key: "****",
            //     accesskey: "****"
            // })        

            try {
                const s3 = new AWS.S3({
                    apiVersion: "2006-03-01",
                    region: process.env.AWS_REGION,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
                    params: { Bucket: bucket }
                })
                
                var url = s3.getSignedUrl("putObject", {
                    Bucket: bucket,
                    Key: key,
                    Expires: timeout,
                    ContentType: type,
                }) 
            } catch(error) {
                throw new UserInputError(error)
            }

            return { url }
        },
        addPost: async (root, args) => {
            const user = await User.findById({ _id: args.user })

            if (args.title.length > 100) {
                throw new UserInputError("Add Post failed, please within 100 letters!")
            }

            const post = new Post({
                url: args.url,
                filter: args.filter,
                title: args.title,
                user: args.user
            })
        
            const savedPost = await post.save()
            user.posts = user.posts.concat(savedPost.id)
            await user.save()

            return savedPost
        },
        addPostLikes: async (root, args) => {
            const post = await Post.findById(args.id)

            const postSaved = {
                likes: args.likes
            }

            await Post.updateOne({ _id: args.id }, postSaved)

            const update = {
                ...post._doc,
                likes: args.likes,
                id: post._id
            }

            return update
        },
        removePostLikes: async (root, args) => {
            const post = await Post.findById(args.id)

            const postSaved = {
                likes: args.likes
            }

            await Post.updateOne({ _id: args.id }, postSaved)

            const update = {
                ...post._doc,
                likes: args.likes,
                id: post._id
            }
         
            return update
        },  
        addComment: async (root, args) => {
            const post = await Post.findById(args.post)

            if (args.content.length > 50) {
                throw new UserInputError("Add Comment failed, please within 50 letters!")
            }

            const comment = new Comment({
                content: args.content,
                user: args.user,
                post: args.post
            })

            const savedComment = await comment.save()
            post.comments = post.comments.concat(savedComment.id)
            await post.save()

            return savedComment
        },
        addCommentLikes: async (root, args) => {
            const comment = await Comment.findById(args.id)

            const commentSaved = {
                likes: args.likes
            }

            await Comment.updateOne({ _id: args.id }, commentSaved)

            const update = {
                ...comment._doc,
                likes: args.likes,
                id: comment._id
            }

            return update
        },
        removeCommentLikes: async (root, args) => {
            const comment = await Comment.findById(args.id)

            const commentSaved = {
                likes: args.likes
            }

            await Comment.updateOne({ _id: args.id }, commentSaved)

            const update = {
                ...comment._doc,
                likes: args.likes,
                id: comment._id
            }

            return update
        },
        addChildComment: async (root, args) => {
            const comment = await Comment.findById(args.parentComment)

            if (args.content.length > 100) {
                throw new UserInputError("Add Comment failed, please within 50 letters!")
            }

            const childComment = new ChildComment({
                content: args.content,
                user: args.user,
                replyTo: args.replyTo,
                parentComment: args.parentComment
            })

            const childCommentSaved = await childComment.save()
            comment.childComments = comment.childComments.concat(childCommentSaved.id)
            await comment.save()

            return childCommentSaved
        },
        addChildCommentLikes: async (root, args) => {
            const childComment = await ChildComment.findById(args.id)

            const childCommentSaved = {
                likes: args.likes
            }

            await ChildComment.updateOne({ _id: args.id }, childCommentSaved)

            const update = {
                ...childComment._doc,
                likes: args.likes,
                id: childComment._id
            }

            return update
        },
        removeChildCommentLikes: async (root, args) => {
            const childComment = await ChildComment.findById(args.id)

            const childCommentSaved = {
                likes: args.likes
            }

            await ChildComment.updateOne({ _id: args.id }, childCommentSaved)

            const update = {
                ...childComment._doc,
                likes: args.likes,
                id: childComment._id
            }

            return update
        },
        createUser: async (root, args) => {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(args.passwordHash, saltRounds)

            userExist = await User.find({ username: args.username})
   
            if (userExist.length !== 0) {
                throw new UserInputError("Username has been taken! Please register again!")
            } 

            const user = new User({ 
                username: args.username, 
                avatar: args.avatar,
                passwordHash: passwordHash 
            })
            
            return await user.save()
                .catch(error => {
                throw new UserInputError(error)
            })
        },
        addFriend: async (root, args) => {
            const user = await User.findById(args.id)

            const userSaved = {
                friends: args.friends
            }

            await User.updateOne({ _id: args.id }, userSaved)

            const update = {
                ...user._doc,
                friends: args.friends,
                id: user._id
            }

            return update 
        },
        removeFriend: async (root, args) => {
            const user = await User.findById(args.id)

            const userSaved = {
                friends: args.friends
            }

            await User.updateOne({ _id: args.id }, userSaved)

            const update = {
                ...user._doc,
                friends: args.friends,
                id: user._id
            }

            return update 
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
        
            const passwordCorrect = user === null
                ? false
                : await bcrypt.compare(args.passwordHash, user.passwordHash)

            if (!(user && passwordCorrect)) {
                throw new UserInputError("wrong credentials")
            }
        
            const userForToken = {
                username: user.username,
                id: user._id,
            }
        
            return { 
                value: jwt.sign(userForToken, JWT_SECRET),
                username: user.username,
                id: user._id
            }
        },
        postMessage: (root, args) => {
            const id = Math.random().toString(36).slice(2,15)
            const username = args.username
            const content = args.content
            const channel_name = args.channel_name
            const created_at = args.created_at

            const message = {
                id,
                username,
                content,
                channel_name,
                created_at,
            }

            // messages.push(message)
            pubsub.publish('postMessage', { postMessage: message })

            return message 
        },
    },
    Subscription: {
        postMessage: {
          subscribe: withFilter(
            () => pubsub.asyncIterator('postMessage'),
            (payload, args) => {
             return payload.postMessage.channel_name === args.channel_name
            },
          ),
        }
    }
}



const PORT = 4000
const app = express()

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: { path: '/graphql-ws' }
})

server.applyMiddleware({ app })
const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

app.use(cors())
app.use(express.static('build'))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build','index.html'))
})

httpServer.listen(PORT, () => {
    console.log(`Server ready at ${PORT}${server.graphqlPath}`)
    console.log(`Subscriptions ready at ${PORT}${server.subscriptionsPath}`)
})