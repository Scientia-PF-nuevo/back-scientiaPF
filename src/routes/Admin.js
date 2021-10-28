const server = require('express').Router()
const { User, Course } = require('../db.js')





server.get("/listdata" ,async(req, res)=>{
  //curso para aprovar link de video, Imagen, email, 

  const courses = await Course.findAll();
  
  const filter= courses.filter(course => course.state === 'pendingToApprove')
  res.send(filter);


} )

// put para cambiar el estado del curso 
server.patch("/editcoursestate:/state:/id" ,(req, res)=>{
 
  const { state, id } = req.params 

	Course.findByPk(id)
		.then((course) => {
			if (!course) return res.status(404).send('Id not valid')
			return course.update({ state: state })
		})
		.then((course) => res.send(course))
		.catch((err) => res.status(500).send(err))


} )


//para promover un usuario normal a admin
server.put('/promote/:email', /*isAdmin,*/ (req, res) => {
	const estado  = req.body.isAdmin;
    const email = req.params.email;
	User.findOne({where: {email:email}})
		.then((course) => {
			if (!course) return res.status(404).send('User not found')
			return course.update({ isAdmin: estado })
		})
		.then((course) => res.send(course))
		.catch((err) => res.status(500).send(err))
});


// para dar de baja un usuario
server.put('/ban/:email', /*isAdmin,*/ (req, res) => {
	const estado  = req.body.isAdmin;
	const email = req.params.email;
    User.findOne({where:{email:email}})
		.then((course) => {
			if (!course) return res.status(404).send('User not found')
			return course.update({ active: estado })
		})
		.then((course) => res.send(course))
		.catch((err) => res.status(500).send(err))
});

//para crear un nuevo admin
server.post('/newadmin', async (req, res)=> { 
    const {firstName, lastName,email,password,address,phone,city,province,postalcode,country,
    } = req.body;

    if( !firstName &&
        !lastName &&
        !email &&
        !password){
            res.send(400).send('Faltan datos');
        }
    try {
      const course = await User.create(
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
          isAdmin: true,
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
  
      if (course) {
        res.status(200).send({
          msg: "Admin created successfully",
          status: 200,
          course,
        });
      } else {
        res.status(500).send({
          msg: "Failed to create Admin",
          status: 500,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        msg: "Failed route /newadmin",
        status: 500,
      });
    }
})

// consulta de ordenes pendientes
server.get('/orders', async (req, res) => {

})


module.exports = server
