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
const dot = require('dotenv')

dot.config()
axios.defaults.baseURL = 'http://localhost:3001';

var local = "";

if(process.env.PORT == 3001){
  local = "http://localhost:3001";
}else{
  local = "https://scientiapf.herokuapp.com";
}

const usersloader = async()=>{
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
console.log(process.env.PORT)
const categoriesLoader =async()=>{
  Categories.forEach(async(c)=>{
    const cat = await Category.create(
      {name: c.name})
      console.log("category",cat.name)
    })
  }
  
/*   cursosLoader = async()=>{
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

} */


const cargaCursos = async () => {
  const cargacursos=Courses.map(async (c) => {
    const response = await fetch(`${local}/courses/newcourse`, {
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
    const response = await fetch(`${local}/courses/newreview`, {
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
    
    const response = await fetch(`${local}/order/${u.emailBuyer}`, {
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
    const response = await fetch(`${local}/purchase/orders_destroy/${u.emailBuyer}`, {
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
const updateSolds=async()=>{
  const updateAll = await Course.findAll({})
  let update1 = updateAll.map(async(u,index)=>{
    await Course.update({
      solds:(index*2)
    },{
      where:{
        id:u.id
      }
    })
    return console.log("updated1",index)
  })

  Promise.all(update1).then(async() => {
     console.log("updated1")
    const updateFreeOnes = await Course.findAll({
      where:{
        price:0
      }
    })
    let updated = updateFreeOnes.map(async(u,index)=>{
      await Course.update({
        solds:(index*12)
      },{
        where:{
          id:u.id
        }
      })
      return console.log("updated free course id", u.id, u.solds)
    })
  
    Promise.all(updated).then(() => {
      return console.log("updated")
    })
 })

}

// Syncing all the models at once.
conn.sync({ force: true }).then(async () => {
  
  //await cursosLoader();
  server.listen(process.env.PORT, async () => {

   setTimeout(usersloader, 0, "users");
    setTimeout(categoriesLoader, 0, "categories");
    setTimeout(cargaCursos, 3000, 'cursos')
    setTimeout(cargaReviews, 6500, 'reviews');
    setTimeout(cargaCompra, 10000, 'compra de ema');
    setTimeout(cargaPago, 13000, 'pago de emma');
    setTimeout(updateSolds, 16000, 'update');
    console.log('%s listening at ',process.env.PORT); // eslint-disable-line no-console

  });


});
