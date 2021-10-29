const server = require('express').Router()
const { Order, User ,Course } =require('../db.js')

const redirectLogin = require('../middleware/redirectLogin')


//localhost:3001/order/:userId crear orden completa

server.get('/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    const findUserOrder =await Order.findAll({
        where:{
            userEmail:userEmail
        },includes:[Order]            
    });
    if(findUserOrder.length >0){
        res.json(findUserOrder)
    }else{ 
        res.send("el usuario no tiene ordenes")}
});

server.post('/:userEmail', async (req, res) => {
    const { state, courseId, price } = req.body;
        const userEmail = req.params.userEmail

            const user= await User.findOne({
                    where: {
                        email: userEmail
                        }
                    });
                 console.log(userEmail)   
            
                const c =await Course.findOne({
                    where: {
                        id: courseId,               
                    }
                });
                //console.log(c.price)
                const order = await Order.create({      
                    coursesId:courseId,
                    state:state,
                    price:price            
                });
                
                order.addCourse(c)
                order.setUser(user)
            
        res.send({msg:"orden procesada exitosamente"});
    });
    
server.delete('/:userEmail' , async (req, res) => {
            const { courseId } = req.body;

                const findUserOrder =await Order.findOne({
                    where:{
                        coursesId:courseId
                    },includes:[Course]            
                });
               if(findUserOrder){
                findUserOrder.destroy();
                res.send({msg:"orden eliminada"});
               }else{ 
                res.send({msg:"no se encontro la orden"})}
        });

module.exports = server;