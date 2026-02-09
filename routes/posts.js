import express from 'express';
import { upload } from '../utils/upload.js';
import { checkAuth } from '../utils/checkAuth.js';
import { createPost, getAll, getById, getMyPosts } from '../controllers/post.js';

const router = express.Router();

// загрузка картинки
router.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    imageUrl: `/uploads/${req.file.filename}`,
  });
});
// получение постов
router.get('/', getAll);

// Получение моих постов
// http://localhost:3002/api/posts/me
router.get('/me', checkAuth, getMyPosts)

// Получение поста
// http://localhost:3002/api/posts/:id
router.get('/:id', getById)

// создание поста
router.post('/', checkAuth, createPost);

export default router;
