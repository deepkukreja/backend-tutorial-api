import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      minlength: [3, 'Title must contain at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      minlength: [1, 'Content cannot be empty'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
