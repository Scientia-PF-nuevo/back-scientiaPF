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
                    courseId: course.id,                    
                    owner:email,
                    price:course.price,
                    state:'started'
                
            })
            console.log(purchase.courseName)
            purchase.setCourse(course);
            purchase.setUser(user)

            // const created = await Bought_course.findOne({
            //     where:{
            //         courseId:course.id
            //     },
            //     raw:true
            // })
            // console.log(created)
            // return created.json();

        })
        
        res.send({msg:"Compras creadas"})
    })
    
    
})

module.exports = server
