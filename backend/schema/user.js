const mongoose = require('mongoose')



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    friends: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User' 
        }
    ],
    posts: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Post' 
        }
    ],
})



module.exports = mongoose.model('User', userSchema)