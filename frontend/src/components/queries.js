import { gql  } from '@apollo/client'



export const ALL_POSTS = gql`
query {
    allPosts {
        url
        title
        updated
        likes {
            id
        }
        id
        user {
            username
            avatar
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
            }
            post {
                id
            }
            id
        }
    }
}`

export const ADD_POST = gql`
mutation addPost($url: String!, $title: String!, $user: ID!) {
    addPost(
        url: $url
        title: $title
        user: $user
    ) {
        url
        title
        updated
        likes {
            id
        }
        id
        user {
            username
            avatar
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
            }
            post {
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
        title
        updated
        likes {
            id
        }
        id
        user {
            username
            avatar
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
            }
            post {
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
        title
        updated
        likes {
            id
        }
        id
        user {
            username
            avatar
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
            }
            post {
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
        }
        post {
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
        }
        post {
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
        }
        post {
            id
        }
        id
    }
}`