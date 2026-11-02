import mongoose from 'mongoose';
import Post from '../models/Post.js';

function validPostId(id) {
  return mongoose.isObjectIdOrHexString(id);
}

function sendInvalidId(res) {
  return res.status(400).json({ success: false, message: 'Please provide a valid post ID.' });
}

export async function createPost(req, res) {
  const { title, content } = req.body || {};

  if (typeof title !== 'string' || typeof content !== 'string' || !title.trim() || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Both title and content are required.' });
  }

  const post = await Post.create({
    title: title.trim(),
    content: content.trim(),
    owner: req.user._id,
  });

  return res.status(201).json({ success: true, message: 'Post created successfully', post });
}

export async function getAllPosts(req, res) {
  const posts = await Post.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .populate('owner', 'name');

  return res.status(200).json({ success: true, count: posts.length, posts });
}

export async function getPostById(req, res) {
  if (!validPostId(req.params.id)) return sendInvalidId(res);

  const post = await Post.findOne({ _id: req.params.id, owner: req.user._id }).populate('owner', 'name');
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found.' });
  }

  return res.status(200).json({ success: true, post });
}

export async function updatePost(req, res) {
  if (!validPostId(req.params.id)) return sendInvalidId(res);

  const updates = {};
  if (Object.hasOwn(req.body || {}, 'title')) {
    if (typeof req.body.title !== 'string' || !req.body.title.trim()) {
      return res.status(400).json({ success: false, message: 'Title must be a non-empty string.' });
    }
    updates.title = req.body.title.trim();
  }

  if (Object.hasOwn(req.body || {}, 'content')) {
    if (typeof req.body.content !== 'string' || !req.body.content.trim()) {
      return res.status(400).json({ success: false, message: 'Content must be a non-empty string.' });
    }
    updates.content = req.body.content.trim();
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, message: 'Send at least one field: title or content.' });
  }

  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('owner', 'name');

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found.' });
  }

  return res.status(200).json({ success: true, message: 'Post updated successfully', post });
}

export async function deletePost(req, res) {
  if (!validPostId(req.params.id)) return sendInvalidId(res);

  const post = await Post.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found.' });
  }

  return res.status(200).json({ success: true, message: 'Post deleted successfully', postId: post._id });
}
