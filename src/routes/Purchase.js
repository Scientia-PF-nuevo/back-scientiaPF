const server = require('express').Router()
const { Course, Category, Review , User, Bought_course, Order} = require('../db');
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
            //console.log(c)
            const course = await Course.findOne({ 
                where:{
                    id:c.coursesId
                }
            })
            const purchase = await Bought_course.create({               
                    courseId: course.id,                    
                    owner:email,
                    price:course.price,
                    state: false,
                    inProgress: 0
            })
            purchase.setCourse(course);
            purchase.setUser(user)
            const del = async () => {
                const findUserOrder =await Order.findOne({
                    where:{
                        id:c.id
                    },includes:[Order]            
                });
                await findUserOrder.destroy();
            }
            del();
    })
        res.send({msg:"Compras creadas"})
    })
})

module.exports = server
