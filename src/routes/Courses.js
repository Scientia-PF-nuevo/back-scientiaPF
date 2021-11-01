const server = require('express').Router()
const {Course,Category,Review,User,Bought_course} = require('../db');

const getScore = require('../functions/getScore')
const stringifyDate = require('../functions/stringifyDate')
const filterLevel = require('../functions/filterLevel')
const filterPrice = require('../functions/filterPrice')
const filterLanguaje = require('../functions/filterLanguaje')
const filterRanking = require('../functions/filterRanking')
const redirectLogin = require('../middleware/redirectLogin')




server.get('/', (req, res) => {
	const {
		name
	} = req.query;

	name ? (

			Course.findAll({
				include: [{model: Category},
						{model: Review,}
				],
				where: {
					state:'active'
				}
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
						let average=Math.round(getScore(element))

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
								score: average,
								level:element.level,
								language:element.languaje,
								solds: element.solds
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
			include: [{model: Category},
				{model: Review}],
				where: {
					state:'active'
				}
		}).then((courses) => {
			if (courses.length == 0) {
				res.status(404).send({
					msg: 'No se encontro ningun curso en la bd'
				})
				//console.log({msg: 'No se encontro ningun curso'})
			} else {

				const filteredCourses = courses.map(c => {
					let average = Math.round(getScore(c))
					const d = stringifyDate(c.createdAt)
					

					const obj = {
						date: d,
						name: c.name,
						description: c.description,
						price: c.price,
						url: c.url,
						id: c.id,
						categories: c.categories[0].name,
						score: average,
						level:c.level,
						language:c.languaje,
						solds: c.solds,
						numbersOfDiscounts:c.numbersOfDiscounts,
						percentageDiscount:c.percentageDiscount

						
					}
					return obj;
				})
				

				res.status(200).send(filteredCourses)
			}
		})

})

server.get('/filters', async(req, res) => {
	const {level1 , level2, level3,price1, price2,price3, languaje1, languaje2,languaje3,ranking1,ranking2,ranking3, ranking4, ranking5,category } = req.query;
	let parametres = [level1 , level2, level3,price1, price2,price3, languaje1, languaje2,languaje3,ranking1,ranking2,ranking3, ranking4, ranking5]
	let booleanparametres = []
	booleanparametres= parametres.map((p)=>{	
		if(p==="false" || typeof(p)==="undefined") return false;
		else if(p==="true") return true;
	})
		let coursesToFilter = []
		//console.log(category)
		if(category !== "all"){
			// console.log("filtrando por category")
			coursesCategory=[];
			coursesCategory= await Category.findAll({
				where:{
					name:category
				},
				include:{
					model:Course,
					where:{
						state:"active"
					},
					include:{model:Review}
			}
			})
			
			
			coursesToFilter= coursesCategory[0].dataValues.courses.map((c)=>{
				
				const obj = {
					name: c.name,
					description: c.description,
					price: c.price,
					url: c.url,
					id: c.id,
					solds:c.solds,
					categories: [{
						name:category,
						id:coursesCategory.id,
						createdAt:coursesCategory.createdAt,
						updatedAt:coursesCategory.updatedAt,
						course_category:c.course_category
					}],
					reviews:c.reviews,
					createdAt:c.createdAt,
					level:c.level,
					languaje:c.languaje,
					numbersOfDiscounts:c.numbersOfDiscounts,
					percentageDiscount:c.percentageDiscount

				}
				return obj;
			})
			} else {
			coursesToFilter = await Course.findAll({
				where:{
					state:'active'
				},
				include: [{model: Category},
				{model: Review}]
			})

			
		}		
		
				let filteredCourses =[]
				let filteredCourses2 =[]
				let filteredCourses3 =[]
				let filteredCourses4 =[]

				filteredCourses = filterLevel(coursesToFilter,booleanparametres[0],booleanparametres[1],booleanparametres[2])

				//console.log(filteredCourses.length)
				filteredCourses2 = filterPrice(filteredCourses,booleanparametres[3],booleanparametres[4],booleanparametres[5])

				//console.log(filteredCourses2.length)
				filteredCourses3 = filterLanguaje(filteredCourses2,booleanparametres[6],booleanparametres[7],booleanparametres[8])
				//console.log(filteredCourses3.length)

				filteredCourses4 = filterRanking(filteredCourses3,booleanparametres[9],booleanparametres[10],booleanparametres[11],booleanparametres[12],booleanparametres[13])
				
				let coursesToSend = filteredCourses4.map((element)=>{
				//	console.log(element)
					let average = Math.round(getScore(element))
						const d = stringifyDate(element.createdAt)
					 const obj = {
						name: element.name,
						date: d,
						description: element.description,
						price: element.price,
						url: element.url,
						id: element.id,
						categories: element.categories[0].name,
						score: average,
						level:element.level,
						language:element.languaje,
						solds: element.solds,
						numbersOfDiscounts:element.numbersOfDiscounts,
						percentageDiscount:element.percentageDiscount
					}
					return obj
				})
				
				//console.log(filteredCourses4.length)
				filteredCourses.length>0 ? res.send(coursesToSend) : res.send("No hay cursos")
		
   })

server.get('/id/:id',async  (req, res) => {
	const {
		id
	} = req.params;
	

	try {
		id?(
		Course.findOne({
			where: {
				id: id
			},
			include:[
				{model: Category},
				{model: Review},
				{model: User}
			]
		}).then((course)=>{
			
			if (course) {
				//console.log(course.user)
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
            		url:course.url,
					uploadedBy:course.user.email,
					solds:course,
					numbersOfDiscounts:course.numbersOfDiscounts,
					percentageDiscount:course.percentageDiscount

				}
				
				
				res.status(200).send(obj)
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
		level,
		state,
		numbersOfDiscounts, 
		percentageDiscount
	} = req.body

	if (
		!name ||
		!description ||
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
		const user = await User.findOne({
			where: {email:email}
		})
		

		const newCourse = await Course.create({
			name,
			description,
			price,
			url,
			email:email,
			urlVideo,
			languaje,
			level,
			state,
			percentageDiscount,
			numbersOfDiscounts
		})

		const categ = await Category.findOne({
			where: {
				name: category
			}
		})
		await newCourse.addCategories(categ)
		
		await user.addCourses(newCourse)

		res.status(201).send({
			msg: 'curso cargado exitosamente',
			newCourse
		})
	}
	catch (error) {
		console.log(error)
		res.status(400).send({
			msg: 'Error ruta crear curso'
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
			name: name,
			state:'active'
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

	try{const newReview = await Review.create({

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
	// await course.addReview(newReview)
	// await newReview.addUser(user)
	// await User.setReviews(newReview)
	
	await newReview.setCourse(course)
	await newReview.setUser(user)

	res.status(201).send({
		msg: 'review cargado exitosamente',
		newReview
	})}catch(e){
		console.log(e)
	}

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

server.get("/getGift",async(req,res)=>{
	const {
		email,coupon
	} = req.body;
	try {
		const user = await User.findOne({
			where: {
				email: email
			}
		})
		const gift = await Gift.findOne({
			where: {coupon}
		})
		const course = await Course.findOne({
			where:{
				id:gift.courseId
			}
		})
		const newBoughtCourse = await Bought_course.create({
			courseName: course.name,
			courseId: course.id,
			owner: email,
			price: 0,
			state: 'bought',

		})
		newBoughtCourse.setCourse(course);
        newBoughtCourse.setUser(user)

		res.send("El curso ha sido adquirido")
	} catch (e) {
		console.log(e)
	}
})










module.exports = server