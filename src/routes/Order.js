const server = require('express').Router()
const { Op } = require('sequelize')
const {Order, User ,Course, Order_course} =require('../db.js')

//localhost:3000/order/:userId crear orden completa
server.post('/:userEmail', async (req, res) => {
    const {state, courseId, price} = req.body;
        const userEmail = req.params.userEmail
        const findUserOrder =await  User.findOne({
            where:{
                email:userEmail
            },
            include:{model:Order}
        })
        res.send(findUserOrder)
        if(findUserOrder){

        }


        const order = await Order.create({      
            coursesId:courseId,
                    state            
        })
        
        const course = await Course.findOne({
            where: {
                id:courseId,               
            }
        })
        const user= await User.findOne({
            where: {
                email: userEmail
            }
        })
            await order.addCourse(course)
            await order.setUser(user)
        res.send({msg:"Producto cargado"})
    })



module.exports = server