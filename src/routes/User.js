const server = require('express').Router()
const { User, Bought_course,Review,Course } = require('../db');
const jwt =require("jsonwebtoken");

// localhost:3001/users  ----   busca todos los usuarios
server.get('/' , async (req, res) => {
try {
  const users = await User.findAll();
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

//  localhost:3001/users/email  ---- busca usuario por email
server.get ('/email/:email', async (req, res) => {
    const { email } = req.params;
    console.log(email)
    try {
      const usuario = await User.findOne({
          where: {
              email:email
          },
          include: [Bought_course]
      })
      if(usuario){
        const coursesAndData=[];
        const coursesId = usuario.bought_courses.map(async(c)=>{

          const reviews = []
          const course = await Course.findOne({
            where:{
              id:c.courseId
            },
            include:[Review]
          })
          console.log(course)
          course.dataValues.reviews.forEach((r)=>{            
            if(c.courseId === r.dataValues.courseId) {
              reviews.push(r.dataValues)
            } 

          })
          const courseAndReviewAndUrl = {
            course:c,
            reviews,
            urlVideo:course.urlVideo,
            url:course.dataValues.url
          }
          coursesAndData.push(courseAndReviewAndUrl)

          return reviews
        })
        
        Promise.all(coursesId).then(()=>{
          
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
            bought_courses:usuario.bought_courses,
            coursesAndData,
            
  
          }
          res.send( obj)
        })
      }
      
    } catch (err) {
      res.send(err , {status:500 ,msg:"se requiere un email"})
    }
})



server.post('/register', async (req, res)=> { 
    const {
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






module.exports = server

