const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    savesCount: {
        type: Number,
        default: 0
    },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            userName: String,
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
})


const foodModel = mongoose.model("food", foodSchema);


module.exports = foodModel;