const mongoose = require('mongoose')



const commentSchema = new mongoose.Schema({
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
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
})



module.exports = mongoose.model('Comment', commentSchema)