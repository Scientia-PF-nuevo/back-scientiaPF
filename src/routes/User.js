const server = require('express').Router()
const { User, Bought_course,Review,Course } = require('../db');
const jwt =require("jsonwebtoken");
/* const authorize = require('../middleware/authorization');
const AUTH_SIGN =process.env;

//localhost:3000/user/token
server.get("/token", (req, res) => {
	const userEmail = req.body.userEmail;
    const password = req.body.password;

	User.findOne({
		where:{
			email:userEmail,
			password:password
		}
	}).then((user)=>{
		// res.send(user)
		if(user){
				const payload = {
				userEmail: user.email,
				scopes: "customer:read"
			};
			const token = jwt.sign(payload,'123456',{
				expiresIn: 60 * 24 // expires in 24 hours
			});
			res.send({user:userEmail, token:token});
		} else res.status(401).send("Datos no validos")
	})
    
    });
 */

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
        const coursesPlusReviews=[];
        const coursesId = usuario.bought_courses.map(async(c)=>{
          const reviews = []
          const course = await Course.findOne({
            where:{
              id:c.courseId
            },
            include:[Review]
          })
          
          course.dataValues.reviews.forEach((r)=>{            
            if(c.courseId === r.dataValues.courseId) {
              reviews.push(r.dataValues)
            } 

          })
          const courseAndReview = {
            course:c,
            reviews
          }
          coursesPlusReviews.push(courseAndReview)

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
            coursesPlusReviews
  
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

