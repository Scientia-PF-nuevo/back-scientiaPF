const server = require('express').Router()
const { Course, Category, Review, User, Bought_course, Order } = require('../db');
const axios = require('axios');
const { response } = require('express');
const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'TEST-5014021276587978-102020-2aa0263c739b5941b77085e513aa6fad-90743208'
});


server.post('/:email', async (req, res) => {
    const email = req.params.email;
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    let totalPrice = 0;
    const coursesIds = [];
    const fetching = axios.get(`http://localhost:3001/order/${email}`)
        .then(async (curses) => {
            const data = curses.data;
            let response = data.map(async (c) => {
                const course = await Course.findOne({
                    where: {
                        id: c.coursesId
                    },
                    attributes: ['price', 'id']
                })
                const price = await course.get('price')
                const id = await course.get('id')
               
                totalPrice = totalPrice + price;
                return (
                    totalPrice,
                    coursesIds.push(id))
            })
            Promise.all(response).then(async() => {

                let preference = {
                    items: [
                        {
                            title: `payment`,
                            unit_price: totalPrice,
                            quantity: 1,
                        }
                    ],
                    back_urls: {
                        "success": `http://localhost:3000/soldproduct`,
                        "failure": "http://localhost:3000/failedpayment",
                        "pending": "http://localhost:3000/pendingpayment"
                    },
                    auto_return: "approved",
                };
               

               const response= await mercadopago.preferences.create(preference)
               const preferenceId = response.body
               res.send({payUrl: preferenceId.sandbox_init_point, msg: "Pending payment" })
            })
        })

})

server.post('/orders_destroy/:email', async (req, res) => {
    const email = req.params.email;
    const user = await User.findOne({
        where: {
            email: email
        }
    })
    const fetching = axios.get(`http://localhost:3001/order/${email}`)
        .then(async (curses) => {
            const data = curses.data;
          //  console.log(curses)
            let response = data.map(async (c) => {

                const course = await Course.findOne({
                    where: {
                        id: c.coursesId
                    },
                    attributes: ['price', 'id']
                })
                const price = await course.get('price')
                const id = await course.get('id')
               
                const purchase = await Bought_course.create({
                    courseId: id,
                    owner: email,
                    price: price,
                    state: 'started'

                })
                purchase.setCourse(course);
                purchase.setUser(user)


                const del = async () => {
                    const findUserOrder = await Order.findOne({
                        where: {
                            id: c.id
                        }, includes: [Order]
                    });
                    await findUserOrder.destroy();
                }
                del();
                
            })
           res.send({msg:"orders destoyed and succes payment"})
        })

})

server.post('/confirmpurchase', async (req, res)=>{

    console.log("entro el pago")
})


module.exports = server
