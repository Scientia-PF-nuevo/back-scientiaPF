const server = require('express').Router()
const { Order, User ,Course } =require('../db.js')
const axios = require('axios');

const redirectLogin = require('../middleware/redirectLogin');
const { on } = require('superagent');


//localhost:3001/order/:userId crear orden completa

server.get('/:userEmail', async (req, res) => {
    const userEmail = req.params.userEmail
    const findUserOrder =await Order.findAll({
        where:{
            userEmail:userEmail
        },includes:[Course]            
    });
   
    if(findUserOrder.length >0){
        const calculate = findUserOrder.map(async(c)=>{
           //console.log(c.dataValues.coursesId)
            const obj = {
                id:c.dataValues.id,
                state:c.dataValues.state,
                userEmail:c.dataValues.userEmail,
                price:c.dataValues.price,
                offerPrice:0,
                percentageDiscount:0,
                courseName:"",
                coursesId:c.dataValues.coursesId,
                url:""
            }
            
            
            const course = await Course.findOne({
                where: {
                    id: c.dataValues.coursesId,               
                },
                attributes: ['name','url','percentageDiscount']
                   
            })
            const name = await course.get('name')
            const url = await course.get('url')
            const percentageDiscount = await course.get('percentageDiscount')
            obj.percentageDiscount= percentageDiscount;
            obj.courseName = name;
            obj.url = url;
            obj.offerPrice = obj.price - (obj.price * (percentageDiscount/100))
        
           return obj
        })
        //console.log(findUserOrder)
        Promise.all(calculate).then((c)=>{ res.send(c)})
    }else{ 
        res.send([])}
});

server.post('/:userEmail', async (req, res) => {
    const { state, courseId, price } = req.body;
        const userEmail = req.params.userEmail

            const user= await User.findOne({
                    where: {
                        email: userEmail
                        }
                    });
                // console.log(userEmail)   
            
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
                })
                .then(async(order)=>{
                   await order.addCourse(c)
                   await order.setUser(user)
                  
                }).then(async(order)=>{ 
                    const fetching = await axios.get(`http://localhost:3001/order/${userEmail}`)
                    res.send(fetching.data)
                   })
                     
       //res.send({msg:"orden procesada exitosamente"});
    });
    
server.delete('/:userEmail/:courseId' , async (req, res) => {
            const courseId = req.params.courseId;
            const userEmail = req.params.userEmail

                const findUserOrder =await Order.findOne({
                    where:{
                        coursesId:courseId
                    },includes:[Course]            
                });
               if(findUserOrder){
                findUserOrder.destroy();
                
                    const fetching = await axios.get(`http://localhost:3001/order/${userEmail}`)
                    res.send(fetching.data)
                    
                //res.send({msg:"orden eliminada"});
               }else{ 
                res.send({msg:"error ruta delete"})}
        });

module.exports = server;