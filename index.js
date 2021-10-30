//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const courses = require("./testCourses");
const Users = require("./testUsers");
const reviews = require("./testReviews");
const category = require("./testCategories")
const buy = require("./testBuy");
const payment = require("./testPayment");
const { default: fetch } = require('node-fetch');
const axios = require('axios');

//usersloader = async()=>{

//}

const cargaUsers = async () => {
  const cargausers=Users.map(async (u) => {
    const response = await fetch('http://localhost:3001/users/register', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })
    return response
  })
  Promise.all(cargausers).then(() => {
    return console.log("Users cargados")
  })
}
const cargaCategoria = async () => {
  const cargaCategorias= category.map(async (c) => {
    const response = await fetch('http://localhost:3001/courses/newcategory', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c)
    })
    return response
    
  })
  Promise.all(cargaCategorias).then(() => {
    return console.log("Categorias cargadas")
  })
}
const cargaCursos = async () => {
  const cargacursos=courses.map(async (c) => {
    const response = await fetch('http://localhost:3001/courses/newcourse', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c)
    })
    
    return response
  })
  Promise.all(cargacursos).then(() => {
    return console.log("Cursos cargados")
  })
}

const cargaReviews = async () => {
  const cargareviews=reviews.map(async (u) => {
    const response = await fetch('http://localhost:3001/courses/newreview', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })
    return response
  })
  Promise.all(cargareviews).then(() => {
    return console.log("Reviews cargadas")
  })
}
const cargaCompra = async () => {
  const cargacompras=buy.map(async(u) => {
    
    const response = await fetch(`http://localhost:3001/order/${u.emailBuyer}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })
    
    return response
  })
  Promise.all(cargacompras).then(() => {
    return console.log("Compras cargadas")
  })
  
  
}
const cargaPago = async () => {
  const cargapagos=payment.map(async(u) => {
    const response = await fetch(`http://localhost:3001/purchase/orders_destroy/${u.emailBuyer}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })
    return response
  })
  Promise.all(cargapagos).then(() => {
    return console.log("Pagos cargados")
  })
}


// Syncing all the models at once.
conn.sync({ force: true }).then(async () => {
  server.listen(3001, async () => {
    // await cargaUsers().then(async (u) => {
    //   await cargaCategoria().then(async (ca) => {
    //     await cargaCursos().then(async (cu) => {
    //       await cargaReviews().then(async(re) => {
    //         await cargaCompra().then(async (co) => {
    //           await cargaPago().then(async(pa) => {
    //             console.log("Base de datos cargada")
    //           })
    //         })
    //       })
    //     })
    //   })
    // })
    
    
   /*  await cargaUsers();
    await cargaCategoria();
    await cargaCursos();
    await cargaReviews();
    await cargaCompra();
    await cargaPago(); */
    setTimeout(cargaUsers, 0000, 'usuarios reg')
    setTimeout(cargaCategoria, 4000, 'categorias')
    setTimeout(cargaCursos, 7000, 'cursos')
    setTimeout(cargaReviews, 12000, 'reviews');
    setTimeout(cargaCompra, 16000, 'compra de ema');
    setTimeout(cargaPago, 20000, 'pago de emma');

    console.log('%s listening at 3001'); // eslint-disable-line no-console

  });


});
