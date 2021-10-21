const server = require('express').Router()
const { Course, Category, Review, User, Bought_course, Order } = require('../db');
const axios = require('axios');
const { response } = require('express');
const mercadopago = require('mercadopago');
// const token = 'TEST-5014021276587978-102020-2aa0263c739b5941b77085e513aa6fad-90743208';
mercadopago.configure({
    access_token: 'TEST-5014021276587978-102020-2aa0263c739b5941b77085e513aa6fad-90743208'
});
//localhost:3001/purchase/
server.post('/:email', async (req, res) => {
    const email = req.params.email;
    const {token,payment_method_id,issuer_id,installments,payer}=req.body
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
                try {
                    const payment_data = {
                    transaction_amount:totalPrice,
                    token, 
                    description: 'payment',
                    installments,
                    payment_method_id,
                    issuer_id,
                    payer
                }
                mercadopago.payment
                .save(payment_data)
                .then((r)=>{
                    if(r.status===201){
                        const destroy= axios.post(`http://localhost:3001/purchase/orders_destroy/${email}`)
                    }
                    return res.status(r.status).json({
                        status:r.body.status,
                        status_detail:r.body.detail,
                        id:r.body.id
                    })
                })}catch(e){
                    return res.status(500).send(e)
                }
                

           
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
                    attributes: ['price', 'id','name']
                    
                })
                const price = await course.get('price')
                const id = await course.get('id')
                const name = await course.get('name')             

                const purchase = await Bought_course.create({
                    courseName:name,
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
server.get('/feedback', function(req, res) {

    switch(req.query.status){
        case 'success': {
            server.post(`http://localhost:3001/purchase/orders_destroy/${email}`)
            
        
        };
        case 'failure':res.send('fallo el pago');
         case 'pending': res.send('pago pendiente')
    }
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id,
        data: req.query
	});
});




module.exports = server