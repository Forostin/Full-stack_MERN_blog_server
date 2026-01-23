import { Router } from 'express';

import {register, login, getMe} from '../controllers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';

const authRoute = new Router();

 // Register
 // http://localhost:3002/api/auth/register
authRoute.post('/register', register)

 // Login
 // http://localhost:3002/api/auth/login
authRoute.post('/login', login)

 // Get Me
 // http://localhost:3002/api/auth/me
authRoute.get('/me', checkAuth, getMe)

export default authRoute;