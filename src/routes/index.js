const { Router } = require('express');
const { Curso , User } = require('../db');
const fetch = require('node-fetch');
const cors = require('cors');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
router.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const userRouter = require('./User.js')
const coursesRouter = require('./Cursos.js')



router.use('/users', userRouter)
router.use('/courses', coursesRouter)



module.exports = router