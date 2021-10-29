const { Router } = require('express');
const { Course , User } = require('../db');
const fetch = require('node-fetch');
const cors = require('cors');
const session = require('express-session');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();
router.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  router.use(session(
    {
      name: 'sid',
      secret:'secret', // Debería estar en un archivo de environment
      resave:false,
      saveUninitialized:false,
      cookie:{
        maxAge: 1000 * 60 * 60 * 2 // Está en milisegundos --> 2hs
      }
    }
  ));
  

  
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
const userRouter = require('./User.js')
const coursesRouter = require('./Courses.js')
const orderRouter=require('./Order.js')
const purchases  = require('./Purchase')
const createStock = require('./CreateStock')
const createAdmin = require('./Admin')

router.use('/users', userRouter)
router.use('/courses', coursesRouter)
router.use('/order',orderRouter)
router.use('/purchase', purchases)
router.use('/disc', createStock)
router.use('/admin', createAdmin)


module.exports = router