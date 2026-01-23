import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

// Register
export const register = async (req, res) => {
  try {
    const { fullName, passwordHash } = req.body;

    console.log("req.body:", req.body);

    if (!fullName || !passwordHash) {
      return res.status(400).json({ message: "Не хватает fullName или password" });
    }

    // Проверяем, есть ли такой пользователь
    const isUsed = await User.findOne({ fullName });
    if (isUsed) {
      return res.status(400).json({ message: "Цей fullName вже існує." });
    }

    // Хешируем пароль
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(passwordHash, salt);

    // Создаем пользователя
    const newUser = new User({
      fullName,
      passwordHash: hash,
    });

    await newUser.save();

    // Генерируем токен
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      newUser,
      message: 'Регистрация прошла успешно.'
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ошибка при создании пользователя' });
  }
};


// Login
export const login = async (req, res)=>{
    try{
        const{ fullName, passwordHash } = req.body;
        const user = await User.findOne({ fullName });
        if(!user){
            return res.json({
                message: 'Такого пользователя не существует.'
            });                         
        };

        const isPasswordCorrect = await bcrypt.compare(passwordHash, user.passwordHash);

        if(!isPasswordCorrect){
            return res.json({
                message : 'Неверный пароль или логин'
            })
        }

        const token = jwt.sign(
            {
               id : user._id
            },
             process.env.JWT_SECRET,
            { expiresIn: '30d'}, 
        );

        res.json({
            token,
            user,
            message: 'Вы успешно вошли в систему.'
        })
        
        // const { passwordHash, ...userData } = user._doc;

    } catch (error){
        res.json({ message:'Ошибка при aвторизации'});
        console.log(error);
    };
};


// Get Me
export const getMe = async (req, res)=>{
    try {
       const user = await User.findById(req.userId);
       if( !user ){
         return  res.json({ 
             message: 'Користувач не знайден.'
        })
       }

       const token = jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: '30d'}
       );

       res.json({
          user,
          token
       })
    } catch (error){
        res.json({
            message: 'Нет доступа.'
        })
    }
};








