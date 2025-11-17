const { default: mongoose, Schema } = require("mongoose");
const commentSchema = new Schema({
    blog: { type: Schema.Types.ObjectId, ref: 'blog', required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: 'comment', default: null },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('comment', commentSchema);