const server = require('express').Router()
const { Course, Category } = require('../db');

//localhost:3001/courses    obtener todos los cursos
server.get('/', (req, res) => {
	const{ name } = req.query;
    if (name) {
		Product.findAll({
			where: {
			 name : name
					
			},
		}).then((courses) => {
			if (courses.length == 0) {
				res.status(404).send({msg: 'No se encontro ningun curso'})
				console.log({msg: 'No se encontro ningun curso'})
			} else {
				res.status(200).send(courses)
			}
		})
	} 
})


//esta ruta es solo de prueba para cargar manualmente cursos para probar
// si nos funciona la dejamos
server.post('/newcourse', async (req, res) => {
	const { name, description, price,  video, category } = req.body

	if (
		!name ||
		!description ||
		!price ||
		!video ||
		!category
	) {
		res.status(400).send({msg: 'Todos los campos requeridos'})
	}
	try{
		const newCourse = await Course.create({
			name,
			description,
			price,
			video,
			category
		})
		
		await newCourse.setCategory(category)
		res.status(201).send({msg: 'curso cargado exitosamente', curso})

	}catch (err){
		console.log("error: ",err);
	}

})





module.exports = server