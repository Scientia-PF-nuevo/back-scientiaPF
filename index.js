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
const { User, Bought_course,Review,Course, Category,Gift, Order} = require('./src/db');
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const Courses = require("./testCourses");
const Users = require("./testUsers");
const reviews = require("./testReviews");
const Categories = require("./testCategories")
const buy = require("./testBuy");
const payment = require("./testPayment");
const { default: fetch } = require('node-fetch');
const axios = require('axios');

usersloader = async()=>{
  Users.forEach(async(u)=>{
    
    const user = await User.create(
      {
        firstName: u.firstName,
        lastName: u.lastName,
        email : u.email,
        password : u.password,
        address : u.address,
        phone : u.phone,
        city : u.city,
        province : u.province,
        postalcode : u.postalcode,
        country : u.country,
        isAdmin : u.isAdmin,
      })
      console.log("user",user.email)
  })
}

categoriesLoader =async()=>{
  Categories.forEach(async(c)=>{
    const cat = await Category.create(
      {name: c.name})
      console.log("category",cat.name)
    })
  }
  
  cursosLoader = async()=>{
    Courses.forEach(async (c)=>{
      const user = await User.findOne({
        where: {email:c.email}
      })
      const categ = await Category.findOne({
        where: {
          name: c.category
        }
      })
      const newcurso = await Course.create(
        {
          state: c.state,
          numbersOfDiscounts: c.numbersOfDiscounts,
          percentageDiscount: c.percentageDiscount,
          name: c.name,
          level: c.level,
          languaje: c.languaje,
          description: c.description,
          email: c.email,
          url: c.url,
          urlVideo: c.urlVideo,
          price: c.price,
          category: c.category
        })
        console.log("course",newcurso.id)
  })

}

const cargaCursos = async () => {
  const cargacursos=Courses.map(async (c) => {
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
  await usersloader();
  await categoriesLoader();
  //await cursosLoader();
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
    //setTimeout(cargaUsers, 0000, 'usuarios reg')
    //setTimeout(cargaCategoria, 4000, 'categorias')
    setTimeout(cargaCursos, 5000, 'cursos')
    setTimeout(cargaReviews, 8000, 'reviews');
    setTimeout(cargaCompra, 12000, 'compra de ema');
    setTimeout(cargaPago, 16000, 'pago de emma');

    console.log('%s listening at 3001'); // eslint-disable-line no-console

  });


});
