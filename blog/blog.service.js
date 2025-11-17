const userModel = require("../users/user.model");
const responseBase = require("../utils/response-base");
const blogModel = require("./blog.model")


// exports.getAllBlog = async (req, res) => {
    
//     const blog = await blogModel.find().populate('author', '-posts')
//     return res.json(responseBase.success(blog))
// }

// exports.getAllBlog = async (req, res) => {
//   try {
//     const userOnly = req.query.userOnly === 'true';

//     let blogs;
//     if (userOnly) {
//       blogs = await blogModel.find({ author: req.user.id }).populate('author', '-posts');
//     } else {
//       blogs = await blogModel.find().populate('author', '-posts');
//     }

//     return res.json({ success: true, message: 'Blogs fetched successfully', value: blogs, error: null });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: 'Failed to fetch blogs', value: null, error: error.message });
//   }
// };
// exports.getAllBlog = async (req, res) => {
//   try {
//     const { search = '' } = req.query;
//     console.log("Search query:", search);

//     // თუ userOnly parameter არაა, გამოტანა ყველას
//     const blogs = await exports.fetchBlogs({ search });
//     return res.json(responseBase.success(blogs));
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json(responseBase.fail('Failed to fetch blogs', err));
//   }
// };
exports.getAllBlog = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const result = await exports.fetchBlogs({ search, page, pageSize });

    return res.json(responseBase.success(result));
  } catch (err) {
    console.error(err);
    return res.status(500).json(responseBase.fail('Failed to fetch blogs', err));
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json(responseBase.fail('Unauthorized'));
    }

    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const result = await exports.fetchBlogs({
      search,
      page,
      pageSize,
      filter: { author: req.user.id }
    });

    return res.json(responseBase.success(result));
  } catch (err) {
    console.error(err);
    return res.status(500).json(responseBase.fail('Failed to fetch my blogs', err));
  }
};


// exports.getMyBlogs = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json(responseBase.fail('Unauthorized'));
//     }

//     const blogs = await exports.fetchBlogs({ filter: { author: req.user.id } });
//     return res.json(responseBase.success(blogs));
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json(responseBase.fail('Failed to fetch my blogs', err));
//   }
// };
exports.fetchBlogs = async ({ search, filter = {}, page = 1, pageSize = 10 }) => {
  const query = { ...filter };

  if (search && search.trim()) {
    query.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * pageSize;

  const [items, totalCount] = await Promise.all([
    blogModel
      .find(query)
      .populate('author')
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }),

    blogModel.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    items,
    page,
    pageSize,
    totalCount,
    totalPages,
  };
};


exports.getBlogById = async (req, res) => {
    const id = req.params.id
     const blog = await blogModel.findById(id)
            .populate('author', 'fullName email');
    if (!blog) {
        return res.status(404).json(responseBase.fail("blog not found"))
    }
    res.json(responseBase.success(blog))
}
// exports.fetchBlogs = async ({ filter = {}, search = '' } = {}) => {
//   if (search) {
//     filter.title = { $regex: search, $options: 'i' };
//   }
//   const blogs = await blogModel.find(filter).populate('author', '-posts');
//   return blogs;
// };
exports.createBlog = async (req, res) => {
    try {
        const { title, contentHtml, coverImageUrl } = req.body;
        console.log("Request body:", req.body);
        const author = req.user.id;
        console.log("Creating blog with data:", { title, contentHtml, coverImageUrl, author });
        const newBlog = new blogModel({
            title,
            contentHtml,
            coverImageUrl,
            author
        });
        await newBlog.save();
        await userModel.findByIdAndUpdate(author, {
            $push: { courses: newBlog._id }
        });

        return res
            .status(201)
            .json(responseBase.success(newBlog, "blog created successfully"));
    } catch (error) {
        console.error("Create blog error:", error);
        return res
            .status(500)
            .json(responseBase.fail("Failed to create blog", error.message));
    }
};
exports.updateBlog = async (req, res) => {
    console.log("Update blog request body:", req.body);
    const author = req.user.id;
   const { id } = req.params;
    const { title, contentHtml,coverImageUrl } = req.body
    const updateBlog = await blogModel.findByIdAndUpdate(id, {
        title,
        contentHtml,
        coverImageUrl,
        author
    }, { new: true })
    if (!updateBlog) {
        return res.status(404).json(responseBase.fail("blog not found"))
    }
    const updatedBlogDb = await blogModel.findById(author).populate('author', '-posts')
    res.json(responseBase.success(updatedBlogDb, "blog updated successfully"))
}
exports.deleteBlogById = async (req, res) => {
    const id = req.params.id
    const deletedBlog = await blogModel.findByIdAndDelete(id)
    if (!deletedBlog) {
        return res.status(404).json(responseBase.fail("blog not found"))
    }
    res.json(responseBase.success(deletedBlog, "blog deleted successfully"))
}
