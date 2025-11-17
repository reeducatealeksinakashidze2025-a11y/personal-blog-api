const commentModel = require("./comment.model");
const responseBase = require("../utils/response-base");
const mongoose = require("mongoose");

// exports.getCommentsByBlogId = async (req, res) => {
//     try {
//         const blogId = req.params.blogId;

//         if (!mongoose.Types.ObjectId.isValid(blogId)) {
//             return res.status(400).json(responseBase.fail("Invalid blog id"));
//         }

//         const comments = await commentModel.find({ blog: blogId, parentComment: null })
//             .populate('author', '-posts')
//             .lean();

//         const loadReplies = async (comment) => {
//             const replies = await commentModel.find({ parentComment: comment._id })
//                 .populate('author', '-posts')
//                 .lean();
//             for (let r of replies) {
//                 r.replies = await loadReplies(r); // recursive loading
//             }
//             return replies;
//         };

//         for (let c of comments) {
//             c.replies = await loadReplies(c);
//         }

//         res.json(responseBase.success(comments));
//     } catch (err) {
//         console.error(err);
//         res.status(500).json(responseBase.fail("Failed to fetch comments", err.message));
//     }
// };
function populateReplies(commentId) {
  return commentModel
    .find({ parentComment: commentId })
    .populate('author', 'fullName')
    .then(async replies => {
      const nested = [];
      for (const r of replies) {
        const subReplies = await populateReplies(r._id);
        nested.push({
          ...r.toObject(),
          replies: subReplies
        });
      }
      return nested;
    });
}

exports.getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId } = req.params;

    const rootComments = await commentModel
      .find({ blog: blogId, parentComment: null })
      .populate('author', 'fullName');

    const result = [];
    for (const comment of rootComments) {
      const replies = await populateReplies(comment._id);
      result.push({
        ...comment.toObject(),
        replies
      });
    }

    return res.json(responseBase.success(result));
  } catch (err) {
    return res.status(500).json(responseBase.fail("Failed", err));
  }
};


exports.getCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(responseBase.fail("Invalid comment id"));
        }

        const comment = await commentModel.findById(id).populate('author', '-posts');
        if (!comment) return res.status(404).json(responseBase.fail("Comment not found"));

        res.json(responseBase.success(comment));
    } catch (err) {
        console.error(err);
        res.status(500).json(responseBase.fail("Failed to fetch comment", err.message));
    }
};

exports.createComment = async (req, res) => {
    try {
        const { blogId, parentCommentId, text } = req.body;
        const author = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json(responseBase.fail("Invalid blog id"));
        }
        if (parentCommentId && !mongoose.Types.ObjectId.isValid(parentCommentId)) {
            return res.status(400).json(responseBase.fail("Invalid parent comment id"));
        }

        const newComment = new commentModel({
            blog: blogId,
            parentComment: parentCommentId || null,
            author,
            text
        });

        await newComment.save();

        res.status(201).json(responseBase.success(newComment, "Comment created successfully"));
    } catch (err) {
        console.error(err);
        res.status(500).json(responseBase.fail("Failed to create comment", err.message));
    }
};

exports.updateComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { text } = req.body;
        const author = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(responseBase.fail("Invalid comment id"));
        }

        const updatedComment = await commentModel.findOneAndUpdate(
            { _id: id, author }, 
            { text },
            { new: true }
        );

        if (!updatedComment) return res.status(404).json(responseBase.fail("Comment not found or unauthorized"));

        res.json(responseBase.success(updatedComment, "Comment updated successfully"));
    } catch (err) {
        console.error(err);
        res.status(500).json(responseBase.fail("Failed to update comment", err.message));
    }
};

exports.deleteCommentById = async (req, res) => {
    try {
        const id = req.params.id;
        const author = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(responseBase.fail("Invalid comment id"));
        }

        const commentToDelete = await commentModel.findOne({ _id: id, author });
        if (!commentToDelete) return res.status(404).json(responseBase.fail("Comment not found or unauthorized"));

        const deleteReplies = async (commentId) => {
            const replies = await commentModel.find({ parentComment: commentId });
            for (let r of replies) {
                await deleteReplies(r._id);
                await r.remove();
            }
        };

        await deleteReplies(commentToDelete._id);
        await commentToDelete.remove();

        res.json(responseBase.success(commentToDelete, "Comment deleted successfully"));
    } catch (err) {
        console.error(err);
        res.status(500).json(responseBase.fail("Failed to delete comment", err.message));
    }
};
