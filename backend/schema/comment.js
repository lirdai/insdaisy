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
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})



module.exports = mongoose.model('Comment', commentSchema)