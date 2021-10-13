const server = require('express').Router()
const { User } = require('../db');


// localhost:3001/users  ----   busca todos los usuarios
server.get('/' , async (req, res) => {
try {
  const usuarios = await User.findAll();
  if(usuarios.length > 1){
    console.log(usuarios)
    res.send({msg:"todos los usuarios", status: 200, usuarios})
 }else {
    res.send({msg: "no existen usuarios"})
 }
} catch (err) {
  res.send(err , {msg:"error de ruta /users"})
}

})

//  localhost:3001/user/email  ---- busca usuario por email
server.post('/email', async (req, res) => {
    const { email } = req.body;
    console.log(email)
    try {
      const usuario = await User.findOne({
          where: {
              email:email
          }
      })
      if(usuario){
        res.send({msg:"este es tu usuario", usuario})
      }
      
    } catch (err) {
      res.send(err , {status:500 ,msg:"se requiere un email"})
    }
 }
)
// localhost:3001/users/newuser  ---- crear usuariopassword
server.post('/newuser', async (req, res) => {
	const { firstName, lastName, email, password} = req.body

	if (!firstName || !lastName || !email || !password) {
		res.status(400).json({
			message: 'Debe enviar los campos requeridos'
		})
	}
	try {
		const usuario = await User.findOne({
			where: {
				email: email
			}
		})
		if (usuario) {
			res.status(400).send({ msg: 'El email ya existe', status: 400 })
		} else {
			try {
				const user = await User.create({ firstName, lastName, email, password,})
				res.status(201).send({ msg: 'Usuario creado con exito', user, status: 201 })
			}
			catch (err) { res.status(400).send(err) }
		}
	} catch (err) {
		res.status(500).send(err)
	}
})


module.exports = server

