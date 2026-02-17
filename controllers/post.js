import { json, request } from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';


export const getLastTags = async (req, res) => {
  try {
    const posts = await Post.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

// Получение всех постов:
export const getAll = async (req, res) => {
  try {
    const posts = await Post.find();
    const popularPosts = await Post.find()
      .sort({ viewsCount: -1 })
      .limit(3)
      .exec();

    if (!posts.length) {
      return res.json({ message: 'Немає постів' });
    }

    res.json({
      posts,
      popularPosts,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалося отримати статті',
    });
  }
};

export const getById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndUpdate( 
      {
        _id: postId,
      },  
      {
       $inc: { viewsCount: 1 },
      }
    )
     
    if (!post) {
      return res.json({ message: 'Немає постів' });
    }

    res.json(
      post
    );
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалося отримати статті',
    });
  }
};


// Создать пост
export const createPost = async (req, res) => {
  try {
    const { title, text, tags } = req.body;

    if (!title || !text) {
      return res.status(400).json({ message: 'Нет данных' });
    }

    let imageUrl = '';

    if (req.files?.image) {
       //  Присваеваем имя загруженной картинке
      const fileName = Date.now() + '_' + req.files.image.name;
      //  В переменную записываем путь к папке в которой находимся
      const __dirname = dirname(fileURLToPath(import.meta.url));
      //  Создаем ф-цию mv, которая загружает картинку в папку uploads
      await req.files.image.mv(
        path.join(__dirname, '..', 'uploads', fileName)
      );

      imageUrl = `/uploads/${fileName}`;
    }

    const newPost = new Post({
      title,
      text,
      imageUrl,
      tags: tags ? tags.split(',') : [],
      user: req.userId,
    });
     // Сохраняем пост в базе данных
    await newPost.save();

    res.json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
};

// Получение постов пользователя:
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалося отримати статті',
    });
  }
};

// Удаление статьи:
export const removePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete( postId )
     
    if (!post) {
      return res.json({ message: 'Немає поста' });
    }

    await User.findByIdAndUpdate(request.userId, {
       $pull: { posts: postId }
    })
// ++++++++++++
    return res.json(post)
// ===============
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалося видалити статттю',
    });
  }
};

// редактирование поста
export const updatePost = async (req, res) => {
  try {
    const { title, text, id } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // обновляем текст
    post.title = title;
    post.text = text;

    // если есть новая картинка
    if (req.files?.image) {
      const fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));

      req.files.image.mv(
        path.join(__dirname, '..', 'uploads', fileName)
      );

      post.imageUrl = `/uploads/${fileName}`;
    }

    await post.save();

    res.json(post);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не вдалося оновити статтю',
    });
  }
};