import { gql  } from '@apollo/client'



export const ALL_POSTS = gql`
query {
    allPosts {
        url
        filter
        title
        updated
        likes {
            id
        }
        id
        user {
            username
            avatar
            friends {
                id
            }
            id
        }
        comments {
            content
            updated
            likes {
                id
            }
            user {
                username
                avatar
                id
            }
            post {
                id
            }
            childComments {
                content
                updated
                likes {
                  id
                }
                user {
                    username
                    avatar
                    id
                }
                replyTo {
                    username
                }
                parentComment {
                  id
                }
                id
            }
            id
        }
    }
}`

export const ADD_POST = gql`
mutation addPost($url: String!, $filter: String!, $title: String!, $user: ID!) {
    addPost(
        url: $url
        filter: $filter
        title: $title
        user: $user
    ) {
        url
        filter
        title
        updated
        likes {
            id
        }
        id
        user {
            username
            avatar
            friends {
                id
            }
            id
        }
        comments {
            content
            updated
            likes {
                id
            }
            user {
                username
                avatar
                id
            }
            post {
                id
            }
            childComments {
                content
                updated
                likes {
                  id
                }
                user {
                    username
                    avatar
                }
                replyTo {
                    username
                }
                parentComment {
                  id
                }
                id
            }
            id
        }
    }
}`

export const ADD_POST_LIKES = gql`
mutation addPostLikes($id: ID!, $likes: [ID]!) {
    addPostLikes(
        id: $id
        likes: $likes
    ) {
        url
        filter
        title
        updated
        likes {
            id
        }
        id
        user {
            username
            avatar
            friends {
                id
            }
            id
        }
        comments {
            content
            updated
            likes {
                id
            }
            user {
                username
                avatar
                id
            }
            post {
                id
            }
            childComments {
                content
                updated
                likes {
                  id
                }
                user {
                    username
                    avatar
                }
                replyTo {
                    username
                }
                parentComment {
                  id
                }
                id
            }
            id
        }
    }
}`

export const REMOVE_POST_LIKES = gql`
mutation removePostLikes($id: ID!, $likes: [ID]!) {
    removePostLikes(
        id: $id
        likes: $likes
    ) {
        url
        filter
        title
        updated
        likes {
            id
        }
        id
        user {
            username
            avatar
            friends {
                id
            }
            id
        }
        comments {
            content
            updated
            likes {
                id
            }
            user {
                username
                avatar
                id
            }
            post {
                id
            }
            childComments {
                content
                updated
                likes {
                  id
                }
                user {
                    username
                    avatar
                }
                replyTo {
                    username
                }
                parentComment {
                  id
                }
                id
            }
            id
        }
    }
}`

export const ADD_COMMENT = gql`
mutation addComment($content: String!, $user: ID!, $post: ID!) {
    addComment(
        content: $content
        user: $user
        post: $post
    ) {
        content
        updated
        likes {
            id
        }
        user {
            username
            avatar
            id
        }
        post {
            id
        }
        childComments {
            content
            updated
            likes {
              id
            }
            user {
                username
                avatar
                id
            }
            replyTo {
                username
            }
            parentComment {
              id
            }
            id
        }
        id
    }
}`

export const ADD_COMMENT_LIKES = gql`
mutation addCommentLikes($id: ID!, $likes: [ID]!) {
    addCommentLikes(
        id: $id
        likes: $likes
    ) {
        content
        updated
        likes {
            id
        }
        user {
            username
            avatar
            id
        }
        post {
            id
        }
        childComments {
            content
            updated
            likes {
              id
            }
            user {
                username
                avatar
                id
            }
            replyTo {
                username
            }
            parentComment {
              id
            }
            id
        }
        id
    }
}`

export const REMOVE_COMMENT_LIKES = gql`
mutation removeCommentLikes($id: ID!, $likes: [ID]!) {
    removeCommentLikes(
        id: $id
        likes: $likes
    ) {
        content
        updated
        likes {
            id
        }
        user {
            username
            avatar
            id
        }
        post {
            id
        }
        childComments {
            content
            updated
            likes {
              id
            }
            user {
                username
                avatar
                id
            }
            replyTo {
                username
            }
            parentComment {
              id
            }
            id
        }
        id
    }
}`

export const ADD_CHILD_COMMENT = gql`
mutation addChildComment($content: String!, $user: ID!, $parentComment: ID!, $replyTo: ID!) {
    addChildComment(
        content: $content
        user: $user
        replyTo: $replyTo
        parentComment: $parentComment
    ) {
        content
        updated
        likes {
            id
        }
        user {
            username
            avatar
            id
        }
        replyTo {
            username
        }
        parentComment {
            id
        }
        id
    }
}`

export const ADD_CHILD_COMMENT_LIKES = gql`
mutation addChildCommentLikes($id: ID!, $likes: [ID]!) {
    addChildCommentLikes(
        id: $id
        likes: $likes
    ) {
        content
        updated
        likes {
            id
        }
        user {
            username
            avatar
            id
        }
        replyTo {
            username
        }
        parentComment {
            id
        }
        id
    }
}`

export const REMOVE_CHILD_COMMENT_LIKES = gql`
mutation removeChildCommentLikes($id: ID!, $likes: [ID]!) {
    removeChildCommentLikes(
        id: $id
        likes: $likes
    ) {
        content
        updated
        likes {
            id
        }
        user {
            username
            avatar
            id
        }
        replyTo {
            username
        }
        parentComment {
            id
        }
        id
    }
}`

export const FIND_USER = gql`
query findUser($id: ID!) {
    findUser(id: $id) {
        username
        avatar
        friends {
            id
        }
        posts {
            id
        }
        id
    }
}`

export const ADD_FRIEND = gql`
mutation addFriend($id: ID!, $friends: [ID]!) {
    addFriend(
        id: $id
        friends: $friends
    ) {
        username
        avatar
        friends {
            id
        }
        posts {
            id
        }
        id
    }
}`

export const REMOVE_FRIEND = gql`
mutation removeFriend($id: ID!, $friends: [ID]!) {
    removeFriend(
        id: $id
        friends: $friends
    ) {
        username
        avatar
        friends {
            id
        }
        posts {
            id
        }
        id
    }
}`