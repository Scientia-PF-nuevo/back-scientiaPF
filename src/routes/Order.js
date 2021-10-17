const server = require('express').Router()
const { Op } = require('sequelize')
const {Order, User ,Course, Order_course} =require('../db.js')

//localhost:3000/order/:userId crear orden completa
server.get('/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    const findUserOrder =await Order.findAll({
        where:{
            userEmail:userEmail
        },includes:[Course]            
    })
    const obj = {
     allCoursesId:[],
     state:""       
    }
    const orders=findUserOrder.map((o)=>{
      obj.allCoursesId.push(o.coursesId[0])
      obj.state = o.state
    })
    res.json(obj)


})
server.post('/:userEmail', async (req, res) => {
    const {state, courseId, price} = req.body;
        const userEmail = req.params.userEmail
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
            //res.send({msg:"Producto cargado"})
    
            const findUserOrder =await Order.findAll({
                where:{
                    userEmail:userEmail
                },includes:[Course]            
            })
            const obj = {
             allCoursesId:[],
             state:""       
            }
            const orders=findUserOrder.map((o)=>{
              obj.allCoursesId.push(o.coursesId[0])
              obj.state = o.state
            })
            res.json(obj)

       
    })
    server.delete('/:userEmail', async (req, res) => {
            const {state, courseId, price} = req.body;
           
                const findUserOrder =await Order.findOne({
                    where:{
                        coursesId:courseId
                    },includes:[Course]            
                })
                findUserOrder.destroy()
              
                res.send("curso eliminado de carrito")
    
           
        })


module.exports = server