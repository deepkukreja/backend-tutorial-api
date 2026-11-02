import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '../controllers/postController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.route('/').post(createPost).get(getAllPosts);
router.route('/:id').get(getPostById).patch(updatePost).delete(deletePost);

export default router;
