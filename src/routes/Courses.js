const server = require('express').Router()
const { Course, Category, Review , User, Bought_course} = require('../db');



//prueba
//localhost:3001/courses    obtener todos los cursos



server.get('/', (req, res) => {
	const{ name } = req.query;
    
	name ?(
	
	Course.findAll({
		include: [
				{model: Category},
				{model: Review}
	]}).then((courses) => {
		if (courses == null) {
			res.status(404).send({msg: 'No se encontro ningun curso por nombre'})
			//console.log({msg: 'No se encontro ningun curso'})
		}else{
			const n = name.toLowerCase()
			const response= [];
		courses.forEach(element => {		
			let suma=0;
			let average;
			const SCs = element.reviews.map((r,index)=>{						
				suma = suma+r.score;
				console.log(suma)
				average = suma/index;						
			});
		 if(element.name.toLowerCase().includes(n)){
				const date = JSON.stringify(element.createdAt).slice(0,8).split('-').reverse().join('').replace(`"`, "")
				
				const obj ={ name:element.name,
					date :date,
					description:element.description,
					price:element.price,
					url:element.url,
					id:element.id,
					categories: element.categories[0].name,
					score:average
					//score a modificar
}
				//console.log(courses)
				response.push(obj)
			}
		});
		if(!response.length){
			console.log("vacio",response)
			res.status(204).send({msg: 'No se encontro ningun curso por nombre'})			
				
			}else { 
				res.status(200).send(response)

				console.log("cond datos"), response}
	}
}))

		
	 :
		Course.findAll({
			include: [
					{model: Category},
					{model: Review}
        ]}).then((courses) => {
			if (courses.length == 0) {
				res.status(404).send({msg: 'No se encontro ningun curso en la bd'})
				//console.log({msg: 'No se encontro ningun curso'})
			}else {
				
				const filteredCourses = courses.map(c => {
					let suma=0;
					let average;
					const SCs = c.reviews.map((r,index)=>{						
						suma = suma+r.score;
						console.log(suma)
						average = suma/index;						
					});
					
					const d =JSON.stringify(c.createdAt).slice(0,8).split('-').reverse().join('').replace(`"`, "")
					
					const obj = {
						date:d,
						name:c.name,
						description:c.description,
						price:c.price,
						url:c.url,
						id:c.id,
						categories:c.categories[0].name,
						score:average
						//score a modificar
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
		
		res.status(201).send(allcategories)

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

server.post("/newreview", async(req, res)=>{
    const{comments, score, email, courseName } =req.body;

    const newReview = await Review.create({ 
    
		comments:comments,
		score:score,
		commentUser:email
		
    })
	
	const course = await Course.findOne({
		where: {
			name: courseName
		}
	})
	const user= await User.findOne({
		where: {
			email: email
		}
	})
		await newReview.setCourse(course)
		await newReview.setUser(user)

		res.status(201).send({msg: 'review cargado exitosamente', newReview})	

})

server.get("/allreviews", async(req, res)=>{

    const rev = await Review.findAll({ 
    
    	include:Course
    })
	Promise.all(rev)
	.then(data => 
	 res.json(data)
	)
})

server.put("/:email",async(req,res)=>{
	const email = req.params;
	const {courseId, state, timeWatched, lenghtVideo} = req.body;
	
	try{
		const find = await Bought_course.findOne({
			where:{
				courseId
			}
		});
		if(find){
			const course = await Bought_course.update({
				state:state,
				timeWatched:timeWatched,
				lenghtVideo:lenghtVideo
			},
			{where:{courseId:courseId}}
			)
			res.send("curso modificado")

		}else{
			res.send({msg:"El curso no existe"})
		}

	}catch(e){
		console.log(e)
	}
})

	

	
	
	






module.exports = server