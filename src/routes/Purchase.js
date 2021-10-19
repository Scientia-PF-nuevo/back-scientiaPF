const server = require('express').Router()
const { Course, Category, Review , User, Bought_course} = require('../db');
const axios = require ('axios');
const { response } = require('express');


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
            // console.log(typeof(course))
            
            const purchase = await Bought_course.create({               
                    courseName: course.id,                    
                    owner:email,
                    price:course.price,
                    state:'started'
                
            })
            console.log(purchase.courseName)
            purchase.setCourse(course);
            purchase.setUser(user)

            Bought_course.findOne({
                where:{
                    courseName:course.id
                }                
            })
            .then((B)=> B.json())
            
            // return created.json();

        })
        // Promise.all(response).then(()=>res.send(response))
        res.send(response)
    })
    
    
})

module.exports = server
