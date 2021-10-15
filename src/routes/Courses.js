const server = require('express').Router()
const { Course, Category } = require('../db');

//localhost:3001/courses    obtener todos los cursos
server.get('/', (req, res) => {
	const{ name } = req.query;
    name ?
		Course.findOne({
			where: {
			 name:name 
					
			},
		}).then((courses) => {
			//console.log(courses)
			if (courses == null) {
				res.status(404).send({msg: 'No se encontro ningun curso por nombre'})
				//console.log({msg: 'No se encontro ningun curso'})
			} else {
					
				res.status(200).send(courses)
			}
		})  :
		Course.findAll().then((courses) => {
			if (courses.length == 0) {
				res.status(404).send({msg: 'No se encontro ningun curso en la bd'})
				//console.log({msg: 'No se encontro ningun curso'})
			}else {

				const filteredCourses = courses.map(c => {
					const d =JSON.stringify(c.createdAt).slice(0,8).split('-').reverse().join('').replace(`"`, "")
					const obj = {
						date:d,
						name:c.name,
						description:c.description,
						price:c.price,
						url:c.url,
						id:c.id	
					}
					return obj;
				})
				//console.log(filteredCourses) 

				res.status(200).send(filteredCourses)
			}
		})
	
})


//esta ruta es solo de prueba para cargar manualmente cursos para probar
// si nos funciona la dejamos
// localhost:3001/courses/newcourse
server.post('/newcourse', async (req, res) => {
	const { name, description, price,  url, category, email } = req.body
	
	if (
		!name ||
		!description ||
		!price ||
		!url ||
		!category ||
		!email
	) {
		res.status(400).send({msg: 'Todos los campos requeridos'})
	}
	try{
		const newCourse = await Course.create({
			name,
			description,
			price,
			url,
			email
		})
		const categ = await Category.findOne({
			where: {
				name: category
			}
		})
			await newCourse.addCategories(categ)
			res.status(201).send({msg: 'curso cargado exitosamente', newCourse})	

	}catch (err){
		//console.log("error: ",err);
		res.status(400).send({msg:"error"})
	}

})
// localhost:3001/courses/newcategory
server.post('/newcategory', async (req, res) => {
	const { name } = req.body
	
	if (
		!name 
	) {
		res.status(400).send({msg: 'Nombre de categoria requerida'})
	}
	try{
		const newCategory = await Category.create({
			name,
		})
		
		res.status(201).send({msg: 'categoria cargada exitosamente', newCategory})

	}catch (err){
		//console.log("error: ",err);
		res.status(400).send({msg:"fallo la carga de la categoria"})
	}
})

// localhost:3001/courses/allcategories 
server.get('/allcategories', async (req,res) => {
	try{
		const allcategories = await Category.findAll()
		
		res.status(201).send({msg: 'todas las categorias', allcategories})

	}catch (err){
		console.log("error: ",err);
		res.status(400).send({msg:"error"})
	}
})
// localhost:3001/courses/coursescategory
server.get("/coursescategory", async(req, res)=>{
    const{name} =req.body;
  
    const categories = await Category.findAll({ 
      where:{name:name},
      include:Course
    })
	Promise.all(categories)
	.then(data => 
	 res.json(data)
	)
})




module.exports = server