const server = require('express').Router()
const { User, Bought_course,Review,Course, Category,Gift, Order} = require('../db');
const jwt =require("jsonwebtoken");

const redirectLogin = require('../middleware/redirectLogin');
//var sendMail = require('../mailer/mailer');


// localhost:3001/users  ----   busca todos los usuarios
server.get('/' , async (req, res) => {
try {
  const users = await User.findAll({attributes: {exclude: ['password']}});
  if(users.length > 1){
    //console.log(usuarios)
    res.status(200).send(users)
 }else {
    res.send({msg: "no existen usuarios"})
 }
} catch (err) {
  res.send(err , {msg:"error de ruta /users"})
}

})

server.post('/login' , async (req, res) => {
  const {email , password, cart, isGoogle, firstName,lastName} = req.body;
   

 if (email && password) {
   if(isGoogle){
     console.log("me encontro")
    const userGoogle = await User.findOne({
      where: {
        email: email,
        password: password
      }
    })
    //si el usuario de google esta registrado
    if (userGoogle) {

      //busco sus ordenes anteriores
      const findUserOrder =await Order.findAll({
        where:{
            userEmail:email
        },includes:[Course]            
    })
       //si tenia ordenes anteriores debo agregar el array cart
        if(cart.length > 0){
          if(findUserOrder > 0){
          const filterOrdersToCreate = findUserOrder.map((o)=>{
            const cartMap= cart.map(async(c)=>{
              if(c.coursesId != o.coursesId){
                const course =await Course.findOne({
                  where: {
                      id: c.coursesId,               
                  }
                  });
                  //console.log(c.price)
                  const order = await Order.create({      
                      coursesId:c.coursesId,
                      price:c.price            
                  })
                  .then(async(order)=>{
                    await order.addCourse(course)
                    await order.setUser(userGoogle)
                  })
              }
            })
          })
         }
        //si no tenia ordenes anteriores las creo solamente
        else{
          //si el carro trae algo creo las ordenes
          
            const newOrders = cart.map(async(o)=>{
              const c =await Course.findOne({
                where: {
                    id: o.coursesId,               
                }
                });
                //console.log(c.price)
                const order = await Order.create({      
                    coursesId:o.coursesId,
                    price:o.price            
                })
                .then(async(order)=>{
                  await order.addCourse(c)
                  await order.setUser(userGoogle)
                })
            }) 
          
          }}
          //guardo el inicio de sesion de back
          req.session.userId = userGoogle.email;
          res.send(userGoogle)
    }
     else {// si el uruario de google no esta registro el usuario de google
      const userGoogleRegister = await User.create(
        {
          firstName,
          lastName,
          email,
          password,
          active:true,
        },
        {
          fields: [
            "firstName",
            "lastName",
            "email",
            "password"
            
          ],
        }
      );
  
      if (userGoogleRegister) {
        if(cart.length > 0){
          const newOrders = cart.map(async(o)=>{
            const c =await Course.findOne({
              where: {
                  id: o.coursesId,               
              }
              });
              //console.log(c.price)
              const order = await Order.create({      
                  coursesId:o.coursesId,
                  price:o.price            
              })
              .then(async(order)=>{
                await order.addCourse(c)
                await order.setUser(userGoogleRegister)
              })
          }) 
        }
        req.session.userId = userGoogleRegister.email;
        res.send(userGoogleRegister)
       
      } else {
        res.send("error al crear usuario de google o  carga de ordenes pendientes")

      }
      
    }
   }else// si no es usuario de google
   {
    const userNotGoogle = await User.findOne({
      where: {
        email: email,
        password: password
      }
    })
    if(userNotGoogle){
      const findUserOrder =await Order.findAll({
        where:{
            userEmail:email
        },includes:[Course]            
    })
       //si tenia ordenes anteriores debo agregar el array cart
        if(cart.length > 0){
          if(findUserOrder.length > 0){
            console.log("primer if")
          const filterOrdersToCreate = findUserOrder.map((o)=>{
            const cartMap= cart.map(async(c)=>{
              if(c.coursesId != o.coursesId){
                const course =await Course.findOne({
                  where: {
                      id: c.coursesId,               
                  }
                  });
                  //console.log(c.price)
                  const order = await Order.create({      
                      coursesId:c.coursesId,
                      price:c.price            
                  })
                  .then(async(order)=>{
                    await order.addCourse(course)
                    await order.setUser(userNotGoogle)
                  })
              }
            })
          })
         }
        //si no tenia ordenes anteriores las creo solamente
        else{
          //si el carro trae algo creo las ordenes
          console.log("sin ordenes pendientes")
            const newOrders = cart.map(async(o)=>{
              const course =await Course.findOne({
                where: {
                    id: o.coursesId,               
                }
                });
                //console.log(c.price)
                const order = await Order.create({      
                    coursesId:o.coursesId,
                    price:o.price            
                })
                .then(async(order)=>{
                  await order.addCourse(course)
                  await order.setUser(userNotGoogle)
                })
            }) 
          
          }}
          //guardo el inicio de sesion de back
          req.session.userId = userNotGoogle.email;
          res.send(userNotGoogle)

    }
    else{
      res.send("Check your email and password")
    }
   }
 }
})

server.post('/logout', redirectLogin, (req, res) => {
 try{ 
   req.session.destroy(err =>{
    if(err) {
      return res.send(err);
    }
    res.clearCookie('sid');
    res.status(201).send({msg:"logout"})
  })}
  catch(err){
    res.send(err)
  }
});


//  localhost:3001/users/email  ---- busca usuario por email
server.get ('/email/:email', async (req, res) => {
    const { email } = req.params;
    // console.log(email)
    try {
      const usuario = await User.findOne({
          where: {
              email:email
          },
          include: [
            {model:Bought_course},
            {model:Course}
          ]
      })
      //res.send(usuario)
      if(usuario){
        const coursesAndData=[];

        const giftedCourses = await Gift.findAll({
          where: {
            payerEmail:usuario.email
          }
        })
        const coursesId = usuario.bought_courses.map(async(c)=>{


          const reviews = []
          const course = await Course.findOne({
            where:{
              id:c.courseId
            },
            include:[
              {model:Review},
              {model:Category},
              {model:User},
            ]
          })
         // console.log(course)
          course.dataValues.reviews.forEach((r)=>{            
            if(c.courseId === r.dataValues.courseId) {
              reviews.push(r.dataValues)
            } 

          })

          const courseInfo = {
            course:c,
            categories:course.categories[0].name,
            reviews,
            urlVideo:course.urlVideo,
            url:course.dataValues.url,
            uploadedBy:course.dataValues.email,
            state:course.state,


          }
          coursesAndData.push(courseInfo)

          return reviews
        })
        
        Promise.all(coursesId).then(()=>{
          const uploadedCourses =[]
          if(usuario.courses){
            usuario.courses.forEach((c)=>uploadedCourses.push(c.id))
          }
          const obj={
            firstName:usuario.firstName,
            lastName:usuario.lastName,
            email:usuario.email,
            address:usuario.addres,
            phone:usuario.phone,
            city:usuario.city,
            province:usuario.province,
            postalcode:usuario.postalcode,
            country:usuario.country,
            isAdmin:usuario.isAdmin ,
            coursesAndData,
            uploadedCourses,
            giftedCourses
          }
          res.send(obj)
        })
      } else {
        res.status(404).send("El usuario no se ha encontrado")
      }
      
    } catch (err) {
      res.send(err , {status:500 ,msg:"se requiere un email"})
    }
})



server.post('/register', async (req, res)=> { 
    const {firstName, lastName,email,password,address,phone,city,province,postalcode,country,
    } = req.body;
    try {
      const user = await User.create(
        {
          firstName,
          lastName,
          email,
          password,
          address,
          phone,
          city,
          province,
          postalcode,
          country,
          active:true,
        },
        {
          fields: [
            "firstName",
            "lastName",
            "email",
            "password",
            "address",
            "phone",
            "city",
            "province",
            "postalcode",
            "country",
          ],
        }
      );
  
      if (user) {
        res.status(200).send({
          msg: "User created successfully",
          status: 200,
          user,
        });
      } else {
        res.status(500).send({
          msg: "error al crear el usuario",
          status: 500,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        msg: "error al crear el usuario",
        status: 500,
      });
    }
})

server.put('/updateInfo/:email', redirectLogin,async(req,res)=>{
  const {firstName, lastName,password,address,phone,city,province,postalcode,country, profilePicture
  } = req.body;
  const email = req.params.email;
  const user = await User.findOne({
    where: {
      email,
      password
    }
  })

  if(user){
    try{
      const update = await User.update({
          firstName,
          lastName,
          password,
          address,
          phone,
          city, 
          province, 
          postalcode,
          country,
          profilePicture
      },{
        where:{
        email:email
      }
    })
      res.send("Informacion actualizada con exito")
    } catch(e){
      console.log(e)
    }
  }else {
    res.status(404).send("El email y constraseña no corresponden a un usuario")
  }

})

server.put('/updatePw/:email', redirectLogin ,async(req,res)=>{
  const {oldPassword,newPassword} = req.body;
  const {email} = req.params
  console.log(email)
  const user = await User.findOne({
    where: {
      email,
      password: oldPassword
    }
  })
  if(user){
    try{
      const update = await User.update({
          password: newPassword
      },{
        where:{
        email:email
      }
    })
      res.send("Informacion actualizada con exito")
    } catch(e){
      console.log(e)
    }
  }else {
    res.status(404).send("El email y password no corresponden a un usuario")
  }
})

server.post('/validateGift/:email', async(req,res)=>{
  const{email} = req.params;
  const {coupon} = req.body;
  try{const user = await User.findOne({
    where:{
      email
    }
  })
  const gift = await Gift.findOne({
    where:{
      coupon,
    }
  })
  // console.log(gift.courseId)
  if(gift.state){
    const course = await Course.findOne({
      where:{id:gift.courseId}
    })
    const newCourse = await Bought_course.create({
      courseName: course.name,
      courseId: course.id,
      owner: email,
      price: 0,
      state: 'bought'
    })

    newCourse.setCourse(course);
    newCourse.setUser(user)

    res.send("Cupon validado con exito")
  } else{
    res.send("Cupon invalido")
  }}catch(e){
    console.log(e)
  }

})



module.exports = server

