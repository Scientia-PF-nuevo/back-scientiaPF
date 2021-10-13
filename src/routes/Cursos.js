const server = require('express').Router()
const { Curso } = require('../db');

//localhost:3001/courses    obtener todos los cursos
server.get('/', (req, res) => {
	const{ name } = req.query;
    if (name) {
		Product.findAll({
			where: {
			 name : name
					
			},
		}).then((cursos) => {
			if (cursos.length == 0) {
				res.status(404).send({msg: 'No se encontro ningun curso'})
				console.log({msg: 'No se encontro ningun curso'})
			} else {
				res.status(200).send(cursos)
			}
		})
	} 
})


//esta ruta es solo de prueba para cargar manualmente cursos para probar
// si nos funciona la dejamos
server.post('/newcourse', (req, res) => {
	const { name, description, price,  video, category } = req.body

	if (
		!name ||
		!description ||
		!price ||
		!video ||
		category.length === 0
	) {
		res.status(400).send({msg: 'Todos los campos requeridos'})
	}

	Curso.create({
		name,
		description,
		price,
		video,
		category
	}).then((curso) => {
	        res.status(201).send({msg: 'curso cargado exitosamente', curso})
			console.log(product)
	}).catch ((err) => {
		console.log("error: ",err);
	})
})





module.exports = server