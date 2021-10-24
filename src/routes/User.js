const server = require('express').Router()
const { User, Bought_course,Review,Course, Category } = require('../db');
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
      
      if(usuario){
        const coursesAndData=[];
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
          console.log(course)
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
            uploadedBy:course.user.email
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
            // bought_courses:usuario.bought_courses,
            coursesAndData,
            uploadedCourses
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

server.put('/updateInfo/:email',async(req,res)=>{
  const {firstName, lastName,password,address,phone,city,province,postalcode,country,
  } = req.body;
  const email = req.params.email;
  const user = await User.findOne({
    where: {
      email
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
          country
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
    res.status(404).send("El email no corresponde a un usuario")
  }

})





module.exports = server

