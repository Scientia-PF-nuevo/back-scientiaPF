const server = require('express').Router()
const { Order, User ,Course } =require('../db.js')


//localhost:3001/order/:userId crear orden completa

server.get('/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    const findUserOrder =await Order.findAll({
        where:{
            userEmail:userEmail
        },includes:[Course]            
    });
    if(findUserOrder.length >0){
        res.json(findUserOrder)
    }else{ 
        res.send("el usuario no tiene ordenes")}
});

server.post('/:userEmail', async (req, res) => {
    const { state, courseId } = req.body;
        const userEmail = req.params.userEmail

            const user= await User.findOne({
                    where: {
                        email: userEmail
                        }
                    });
            courseId.forEach(async(e)=>{
                const order = await Order.create({      
                    coursesId:e,
                            state            
                });
                const c =await Course.findOne({
                    where: {
                        id: e,               
                    }
                });
                order.addCourse(c)
                order.setUser(user)
            });
        res.send({msg:"orden procesada exitosamente"});
    });
    
    server.delete('/:userEmail', async (req, res) => {
            const { courseId } = req.body;

                const findUserOrder =await Order.findOne({
                    where:{
                        coursesId:courseId
                    },includes:[Course]            
                });
                findUserOrder.destroy()
                res.send("curso eliminado de carrito")
        });

module.exports = server;