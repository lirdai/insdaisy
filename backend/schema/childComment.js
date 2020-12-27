const mongoose = require('mongoose')



const childCommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    updated: {
        type: Date, 
        default: Date.now
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
         }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
})



module.exports = mongoose.model('ChildComment', childCommentSchema)