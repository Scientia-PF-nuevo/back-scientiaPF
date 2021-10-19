const server = require('express').Router()
const { Course, Category, Review , User, Bought_course} = require('../db');
const axios = require ('axios');


server.post('/:email', async (req, res) => {
    const email = req.params.email;
    const user = await User.findOne({
        where:{
            email:email
        }
    })
    const fetching = axios.get(`http://localhost:3001/order/${email}`)
    .then((curses)=>{ 
        const data = curses.data;
        let response = data.map(async (c)=>{
            // console.log(c.id)
            const course = await Course.findOne({
                where:{
                    id:c.id
                    
                }
            })
            console.log(typeof(course))
            
            const purchase = await Bought_course.create({
               
                    course: course.id,                    
                    owner:email,
                    price:course.price,
                    state:'started'
                
            })
            
            
            purchase.addCourse(course);
            purchase.setUser(user)

            
            

        })
        // res.send(response)
    })
    
    
})

module.exports = server
