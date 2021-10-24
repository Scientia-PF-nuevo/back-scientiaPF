const server = require('express').Router()
const {
	Course,
	Category,
	Review,
	User,
	Bought_course
} = require('../db');

const getScore = require('../functions/getScore')
const stringifyDate = require('../functions/stringifyDate')

//prueba
//localhost:3001/courses    obtener todos los cursos



server.get('/', (req, res) => {
	const {
		name
	} = req.query;

	name ? (

			Course.findAll({
				include: [{
						model: Category
					},
					{
						model: Review
					}
				]
			}).then((courses) => {
				if (courses == null) {
					res.status(404).send({
						msg: 'No se encontro ningun curso por nombre'
					})
					//console.log({msg: 'No se encontro ningun curso'})
				} else {
					const n = name.toLowerCase()
					const response = [];
					courses.forEach(element => {
						let average=getScore(element)

						if (element.name.toLowerCase().includes(n)) {
							const date = stringifyDate(element.createdAt)

							const obj = {
								name: element.name,
								date: date,
								description: element.description,
								price: element.price,
								url: element.url,
								id: element.id,
								categories: element.categories[0].name,
								score: average
							}
							//console.log(courses)
							response.push(obj)
						}
					});
					if (!response.length) {
						console.log("vacio", response)
						res.status(204).send({
							msg: 'No se encontro ningun curso por nombre'
						})

					} else {
						res.status(200).send(response)

						console.log("cond datos"), response
					}
				}
			}))

		:
		Course.findAll({
			include: [{
					model: Category
				},
				{
					model: Review
				}
			]
		}).then((courses) => {
			if (courses.length == 0) {
				res.status(404).send({
					msg: 'No se encontro ningun curso en la bd'
				})
				//console.log({msg: 'No se encontro ningun curso'})
			} else {

				const filteredCourses = courses.map(c => {
					let average = getScore(c)
					const d = stringifyDate(c.createdAt)
					

					const obj = {
						date: d,
						name: c.name,
						description: c.description,
						price: c.price,
						url: c.url,
						id: c.id,
						categories: c.categories[0].name,
						score: average
						//score a modificar
					}
					return obj;
				})
				//console.log(filteredCourses)

				res.status(200).send(filteredCourses)
			}
		})

})

server.get('/filters', (req, res) => {
	const {
	   level1 , 
	   level2, 
	   level3,
	   price1, 
	   price2, 
	   languaje1, 
	   languaje2,
	   languaje3,
	   ranking1,
	   ranking2,
	   ranking3, 
	   ranking4, 
	   ranking5 } = req.query;
	   
	   const filterArray = [
		level1 , 
		level2, 
		level3,
		price1, 
		price2, 
		languaje1, 
		languaje2,
		languaje3,
		ranking1,
		ranking2,
		ranking3, 
		ranking4, 
		ranking5 ];

   
   
		Course.findAll({
			include: [{
					model: Category
				},
				{
					model: Review
				}
			]
		}).then((courses) => {
			if (courses.length == 0) {
				res.status(404).send({
					msg: 'No se encontro ningun curso en la bd'
				})
				//console.log({msg: 'No se encontro ningun curso'})
			} else {
				const array= [];
				//console.log("entro")
					
					if (level1 || 
						level2 ||
						level3 ||
						price1 || 
						price2 || 
						languaje1 || 
						languaje2 ||
						languaje3 ||
						ranking1 ||
						ranking2 ||
						ranking3 ||
						ranking4 || 
						ranking5 ){
						// const data = [];

						// var filteredLevel = courses.filter((c) => {
						// 	return (c.level == level1 || c.level == level2 || c.level == level3 )
						// });
						// if(filteredLevel.length == 0){
						// 	const p = courses.filter((c)=>{
						// 		return (c.price == price1 || c.price == price2 
						// 	)})
							
						// 	data.push(p)
						// } else{
						// 	const f = filteredLevel.filter((c)=>{
						// 		return (c.price == price1 || c.price == price2 
						// 	)})
						// 	data.push(f)
						// }
						// 	let data =[]
						// if(level1){
						// 	filter= courses.forEach((c)=>{
						// 		if(c.level.includes(level1)) {
						// 			data.push(c)}
						// 		 })
						// }
						// res.send(data)

						/* let justStrings;

						  courses.forEach((c)=>{
							  console.log(c.level)
							const asArray = Object.entries(c);
							const filtered=asArray.filter(([key,value])=> value==level1)
							console.log(filtered)
							justStrings = Object.fromEntries(filtered);
						  })

						res.send(justStrings) */

							let data=[];
							let filteredLevel =[]
							let filteredPrice =[]
							let filteredRanking=[]
							let filteredLanguaje=[]
						if(level1 || level2 || level3){
							courses.forEach((c)=>{						
								if(c.level == level1 || c.level == level2 || c.level == level3 ) {
									// data.push(c)
									filteredLevel.push(c)
								}
							})

						}
						if( price1 || price2 ) {
							console.log("hay precio")
						
							if(filteredLevel.length==0){
								console.log("filteredlevel=0")							
								courses.forEach((c)=>{
									if(c.price == price1 || c.price == price2) {
										data.push(c)
									}
								})
								
							} else{
								console.log("aca")
								filteredLevel.forEach((c)=>{	
									
									if(c.price == price1 || c.price == price2) {
										data.push(c)}
									
								})
							}
							console.log(data.length)
							res.send(data)
						} else res.send(filteredLevel) 
						
						// if(languaje1 || languaje2 || languaje3){
						// 	if(filteredLevel.length==0 && filteredPrice.length==0){
						// 		courses.forEach((c)=>{
						// 			if(c.languaje == languaje1 || c.languaje == languaje|| c.languaje == languaje3) {
						// 				data.push(c)
						// 			}
						// 		})
						// 	}
						// }
						
						//  else{
						// 	data.forEach((c)=>{
						// 		if(c.price == price1 || c.price == price2) data.push(c)
						// 	})
						// }
						// if(ranking1 || ranking2 || ranking3 || ranking4 || ranking5){
						// 	courses.forEach((c)=>{
						// 		const average = getScore(c)
						// 		if(average == ranking1 || average == ranking2 || average == ranking3 || average == ranking4 || average == ranking5) filteredRanking.push(c)
						// 	})
						// }
						// if(languaje1 || languaje2 || languaje3 ){
						// 	courses.forEach((c)=>{
						// 		if(languaje1 ==c.languaje|| languaje2==c.languaje || languaje3==c.languaje) filteredLanguaje.push(c)
						// 	})
						// }

						// data = filteredLevel.concat(filteredPrice.concat(filteredRanking.concat(filteredLanguaje)))
						
						// res.send(data)
							// function removeDuplicates(originalArray, prop) {
							// 	var newArray = [];
							// 	var lookupObject  = {};
						
							// 	for(var i in originalArray) {
							// 	lookupObject[originalArray[i][prop]] = originalArray[i];
							// 	}
						
							// 	for(i in lookupObject) {
							// 		newArray.push(lookupObject[i]);
							// 	}
							// 	return newArray;
							// }
						
						// let uniqueArray = removeDuplicates(data, "id");
						// res.send(data)

						

						
						
					/* 
						if(array.length == 0){
							const filteredCourses = courses.map(c => {
								let average = Math.floor(getScore(c));
								const d = stringifyDate(c.createdAt)
								const obj = {
									date: d,
									name: c.name,
									description: c.description,
									price: c.price,
									url: c.url,
									id: c.id,
									categories: c.categories[0].name,
									score: average
									//score a modificar
								}
								return obj;
							})
							array.push(c)
						} *//* else{
							const filteredCourses = array.map(c => {
								let average = Math.floor(getScore(c));
								const d = stringifyDate(c.createdAt)
								const obj = {
									date: d,
									name: c.name,
									description: c.description,
									price: c.price,
									url: c.url,
									id: c.id,
									categories: c.categories[0].name,
									score: average
									//score a modificar
								}
								return obj;
							})
							array.push(c)
						}
						 */
				   
				   /* if(languaje1 || languaje2 || languaje3 === c.level && array.length == 0){
					const filteredCourses = courses.map(c => {
						let average = Math.floor(getScore(c));
						const d = stringifyDate(c.createdAt)
						const obj = {
							date: d,
							name: c.name,
							description: c.description,
							price: c.price,
							url: c.url,
							id: c.id,
							categories: c.categories[0].name,
							score: average
							//score a modificar
						}
						return obj;
					})
					array.push(c)
				   }
				   if(price1 || price2 === c.level && array.length == 0){
					const filteredCourses = courses.map(c => {
						let average = Math.floor(getScore(c));
						const d = stringifyDate(c.createdAt)
						const obj = {
							date: d,
							name: c.name,
							description: c.description,
							price: c.price,
							url: c.url,
							id: c.id,
							categories: c.categories[0].name,
							score: average
							//score a modificar
						}
						return obj;
					})
					array.push(c)
					}
					if(ranking1 || ranking2 || ranking3 || ranking4 || ranking5 === c.level && array.length == 0){
						const filteredCourses = courses.map(c => {
							let average = Math.floor(getScore(c));
							const d = stringifyDate(c.createdAt)
							const obj = {
								date: d,
								name: c.name,
								description: c.description,
								price: c.price,
								url: c.url,
								id: c.id,
								categories: c.categories[0].name,
								score: average
								//score a modificar
							}
							return obj;
						})
						array.push(c)
					   }	 */
				  
				}
				   
			   
			   
			   //console.log(filteredCourses)
   
			  /*  res.status(200).send(filteredCourses) */
		   }
	   })
   
   
   
   })

server.get('/id/:id',async  (req, res) => {
	const {
		id
	} = req.params;
	console.log(id)

	try {
		id?(
		Course.findOne({
			where: {
				id: id
			},
			include:[
				{model: Category},
				{model: Review}
			]
		}).then((course)=>{
			console.log(course)
			if (course) {
				const average = getScore(course)
				const date = stringifyDate(course.createdAt)
				const obj ={
					name: course.name,
					date: date,
					description: course.description,
					price: course.price,
					url: course.url,
					id: course.id,
					categories: course.categories[0].name,
					score: average,
					reviews:course.reviews,
					urlVideo:course.urlVideo,
            		url:course.url
					
				}
				
				
				res.status(200).send({obj})
			} else {
				res.status(404).send({
					msg: 'No se encontro ningun curso'
				})
			}
		})

	):res.status(404).send("Id no enviado")
		
	} catch (error) {
		res.status(404).send({
			msg: 'No se encontro ningun curso'
		})
	}
})

//esta ruta es solo de prueba para cargar manualmente cursos para probar
// si nos funciona la dejamos
// localhost:3001/courses/newcourse
server.post('/newcourse', async (req, res) => {
	const {
		name,
		description,
		price,
		url,
		category,
		email,
		urlVideo,
		languaje,
		level
	} = req.body

	if (
		!name ||
		!description ||
		!price ||
		!url ||
		!category ||
		!email ||
		!urlVideo ||
		!languaje ||
		!level
		
	) {
		res.status(400).send({
			msg: 'Todos los campos requeridos'
		})
	}
	try {
		const newCourse = await Course.create({
			name,
			description,
			price,
			url,
			email,
			urlVideo,
			languaje,
			level
		})
		const categ = await Category.findOne({
			where: {
				name: category
			}
		})
		await newCourse.addCategories(categ)
		res.status(201).send({
			msg: 'curso cargado exitosamente',
			newCourse
		})

	} catch (err) {
		//console.log("error: ",err);
		res.status(400).send({
			msg: "error"
		})
	}

})
// localhost:3001/courses/newcategory
server.post('/newcategory', async (req, res) => {
	const {
		name
	} = req.body

	if (
		!name
	) {
		res.status(400).send({
			msg: 'Nombre de categoria requerida'
		})
	}
	try {
		const newCategory = await Category.create({
			name,
		})

		res.status(201).send({
			msg: 'categoria cargada exitosamente',
			newCategory
		})

	} catch (err) {
		//console.log("error: ",err);
		res.status(400).send({
			msg: "fallo la carga de la categoria"
		})
	}
})

// localhost:3001/courses/allcategories
server.get('/allcategories', async (req, res) => {
	console.log("estoy aqui")
	try {
		const allcategories = await Category.findAll()

		res.status(201).send(allcategories)

	} catch (err) {
		//console.log("error: ",err);
		res.status(400).send({
			msg: "error"
		})
	}
})
// localhost:3001/courses/coursescategory
server.get("/coursescategory", async (req, res) => {
	const {
		name
	} = req.body;

	const categories = await Category.findAll({
		where: {
			name: name
		},
		include: Course
	})
	Promise.all(categories)
		.then(data =>
			res.json(data)
		)
})

server.post("/newreview", async (req, res) => {
	const {
		comments,
		score,
		email,
		courseId
	} = req.body;

	const newReview = await Review.create({

		comments: comments,
		score: score,
		commentUser: email

	})

	const course = await Course.findOne({
		where: {
			id: courseId
		}
	})
	const user = await User.findOne({
		where: {
			email: email
		}
	})
	await newReview.setCourse(course)
	await newReview.setUser(user)

	res.status(201).send({
		msg: 'review cargado exitosamente',
		newReview
	})

})

server.get("/allreviews", async (req, res) => {

	const rev = await Review.findAll({

		include: Course
	})
	Promise.all(rev)
		.then(data =>
			res.json(data)
		)
})

server.put("/:email", async (req, res) => {
	const email = req.params;
	const {
		courseId,
		state,
		timeWatched,
		lenghtVideo
	} = req.body;

	try {
		const find = await Bought_course.findOne({
			where: {
				courseId
			}
		});
		if (find) {
			const course = await Bought_course.update({
				state: state,
				timeWatched: timeWatched,
				lenghtVideo: lenghtVideo
			}, {
				where: {
					courseId: courseId
				}
			})
			res.send("curso modificado")

		} else {
			res.send({
				msg: "El curso no existe"
			})
		}

	} catch (e) {
		console.log(e)
	}
})












module.exports = server