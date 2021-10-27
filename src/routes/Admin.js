const server = require('express').Router()
const { User } = require('../db.js')


//para promover un usuario normal a admin
server.put('/promote/:email', /*isAdmin,*/ (req, res) => {
	const estado  = req.body.isAdmin;
    const email = req.params.email;
	User.findOne({where: {email:email}})
		.then((user) => {
			if (!user) return res.status(404).send('User not found')
			return user.update({ isAdmin: estado })
		})
		.then((user) => res.send(user))
		.catch((err) => res.status(500).send(err))
});


// para dar de baja un usuario
server.put('/ban/:email', /*isAdmin,*/ (req, res) => {
	const estado  = req.body.isAdmin;
	const email = req.params.email;
    User.findOne({where:{email:email}})
		.then((user) => {
			if (!user) return res.status(404).send('User not found')
			return user.update({ active: estado })
		})
		.then((user) => res.send(user))
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
  
      if (user) {
        res.status(200).send({
          msg: "Admin created successfully",
          status: 200,
          user,
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




module.exports = server
