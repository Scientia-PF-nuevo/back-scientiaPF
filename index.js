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

const cargaCategoria = () => {
  category.forEach((c) => {
    const response = fetch('http://localhost:3001/courses/newcategory', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c)
    })

  })

}
const cargaCursos = () => {
  courses.forEach((c) => {
    const response = fetch('http://localhost:3001/courses/newcourse', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c)
    })

  })

}
const cargaUsers = () => {
  Users.forEach(async (u) => {
    const response = fetch('http://localhost:3001/users/register', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })

  })

}

const cargaReviews = async () => {
  reviews.forEach((u) => {
    const response = fetch('http://localhost:3001/courses/newreview', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })
  })
}
const cargaPago = () => {
  payment.forEach((u) => {
    const response = fetch(`http://localhost:3001/purchase/orders_destroy/${u.emailBuyer}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })
  })
}
const cargaCompra = async () => {
  buy.forEach(async(u) => {
   const response = await fetch(`http://localhost:3001/order/${u.emailBuyer}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })
   
  })
  

}


// Syncing all the models at once.
conn.sync({ force: true }).then(async () => {
  server.listen(3001, async () => {
    /* cargaUsers();
    cargaCategoria();
    cargaCursos();
    cargaReviews();
    cargaCompra(); */
    setTimeout(cargaUsers, 0000, 'usuarios reg')
    setTimeout(cargaCategoria, 4000, 'categorias')
    setTimeout(cargaCursos, 7000, 'cursos')
    setTimeout(cargaReviews, 12000, 'reviews');
    setTimeout(cargaCompra, 16000, 'compra de ema');
    setTimeout(cargaPago, 20000, 'pago de emma');

    console.log('%s listening at 3001'); // eslint-disable-line no-console

  });


});
