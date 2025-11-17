const { default: mongoose, Schema } = require("mongoose");

// const CommentSchema = new mongoose.Schema({
//     author: {
//         type: Schema.Types.ObjectId,
//         ref: 'user',
//         require: true
//     },
//     text: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true });
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    coverImageUrl: {
        type: String,
        require: true
    },
    contentHtml: {
        type: String,
        require: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
      isPublished: {
      type: Boolean,
      default: false,
    }
    // comment: [CommentSchema]
}, { timestamps: true })

module.exports = mongoose.model('blog', blogSchema)