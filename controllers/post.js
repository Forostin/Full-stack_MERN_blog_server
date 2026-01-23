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

// export const getById = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     Post.findOneAndUpdate(
//     // Post.findByIdAndUpdate(
//     {
//         _id: postId,
//       },
//       {
//         $inc: { viewsCount: 1 },
//       },
//       {
//         returnDocument: 'after',
//       },
//       (err, doc) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({
//             message: 'Не вдалося знайти статтю',
//           });
//         }

//         if (!doc) {
//           return res.status(404).json({
//             message: 'Стаття не знайдена',
//           });
//         }

//         res.json(doc);
//       },
//     ).populate('user');
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не вдалося отримати статтю',
//     });
//   }
// };

// Удаление статьи:
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};




// Обновить статью:
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await Post.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

// //////////////////////////////////////////////////////////////////////
// Создать пост
export const createPost = async (req, res)=>{
    try {
         const { title, text } = req.body
         const user = await User.findById(req.userId)

         if(req.files){
//  Присваеваем имя загруженной картинке
             let fileName = Date.now().toString() + req.files.image.name;
//  В переменную записываем путь к папке в которой находимся
             const __dirname = dirname(fileURLToPath(import.meta.url));
//  Создаем ф-цию mv, которая загружает картинку в папку uploads
             req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));

             const newPostWithImage = new Post(
                {
                  // username: user.username,
                  title,
                  text,
                  imageUrl: fileName,
                  tags: req.body.tags || [],
                  user: req.userId

                })
// // // Сохраняем пост в базе данных
                await newPostWithImage.save()
// // // Находим пользователя User и в его массив постов добавляем новый пост. В моделе User, const UserSchema есть массив постов posts.                 
                // await User.findByIdAndUpdate(req.userId, {
                //     $push: { posts: newPostWithImage }
                // })

                return res.json(newPostWithImage)
         }

//  Пост без картинки
         const newPostWithoutImage = new Post(
            {
              // username: user.username,
              title,
              text,
              imageUrl: '',
              tags: req.body.tags.split(',') || [],
              user: req.userId
            })
            await newPostWithoutImage.save();
            // await User.findByIdAndUpdate(req.userId, {
            //     $push: { posts: newPostWithoutImage }
            // })
            return res.json(newPostWithoutImage)
        }

    catch(error){
        console.log(error)
        res.json({message: 'Что-то пошло не так'})
        }
}


// ????????????????
