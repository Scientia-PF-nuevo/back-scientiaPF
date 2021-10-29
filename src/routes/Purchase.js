const server = require('express').Router()
const { Course, Category, Review, User, Bought_course, Order, Gift } = require('../db');
const axios = require('axios');
const mercadopago = require('mercadopago');
// const token = 'TEST-5014021276587978-102020-2aa0263c739b5941b77085e513aa6fad-90743208';
mercadopago.configure({
    access_token: 'TEST-5014021276587978-102020-2aa0263c739b5941b77085e513aa6fad-90743208'
});
//localhost:3001/purchase/
const redirectLogin = require('../middleware/redirectLogin');
var transporter = require('../mailer/mailer'); 



server.post('/:email', async (req, res) => {
    const email = req.params.email;
    const { token, payment_method_id, issuer_id, installments, payer } = req.body
   // const disc = req.body.disc ? req.body.disc : 0;
    const disc = false;
    let discountPercentage;
    const finalDiscounts = [];
    if (!disc) {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        let totalPrice = 0;
        const coursesIds = [];
        const fetching = await axios.get(`http://localhost:3001/order/${email}`)
            .then(async (curses) => {
                const data = curses.data;
                let response = data.map(async (c) => {
                    const course = await Course.findOne({
                        where: {
                            id: c.coursesId
                        },
                        attributes: ['price', 'id','numbersOfDiscounts','percentageDiscount']
                    })
                    const price = await course.get('price')
                    const id = await course.get('id')
                    const numbersOfDiscounts = await course.get('numbersOfDiscounts')
                    discountPercentage = await course.get('percentageDiscount')
                    
                    const obj = {
                            id:id,
                            discountPercentage:discountPercentage,
                            numbersOfDiscounts:numbersOfDiscounts,
                            price:price
                    }
                    finalDiscounts.push(obj)

                   // totalPrice = totalPrice + price;
                    return (
                        //totalPrice,
                        coursesIds.push(id))
                })
                Promise.all(response).then(async () => {
                   
                   
                    try {
                        let acc = 0;
                        console.log(finalDiscounts)
                        const final = finalDiscounts.map( (c) => {
                            const numbersOfDiscounts =  c.numbersOfDiscounts
                            if (numbersOfDiscounts) {
                                let priceDiscount =c.price - (c.price * (c.discountPercentage / 100))
                                acc = acc + priceDiscount;
                                //console.log("entre", priceDiscount, acc)
                                return acc;

                            }else{ return acc = acc + c.price }
                        })
                      
                        const payment_data = {
                            transaction_amount: acc,
                            token,
                            description: 'payment',
                            installments,
                            payment_method_id,
                            issuer_id,
                            payer
                        }
                        mercadopago.payment
                            .save(payment_data)
                            .then((r) => {
                                if (r.status === 201) {
                                const destroy = axios.post(`http://localhost:3001/purchase/orders_destroy/${email}`)

                                }
                                return res.status(r.status).json({
                                    status: r.body.status,
                                    status_detail: r.body.detail,
                                    id: r.body.id
                                })
                            })
                    } catch (e) {
                        return res.status(500).send(e)
                    }
                })
            })
    }
})

server.post('/orders_destroy/:emailBuyer', async (req, res) => {
    
    const {emailBuyer} = req.params;
    const {emailGift} = req.query;
    console.log(emailGift)
    const user = await User.findOne({
        where: {
            email: emailBuyer
        }
    })
    const fetching = axios.get(`http://localhost:3001/order/${emailBuyer}`)
        .then(async (curses) => {
            const data = curses.data;
            // console.log(curses)
            let response = data.map(async (c) => {

                const course = await Course.findOne({
                    where: {
                        id: c.coursesId
                    },
                    attributes: ['price', 'id', 'name', "solds", "numbersOfDiscounts"]

                })
                const price = await course.get('price')
                const id = await course.get('id')
                const name = await course.get('name')
                let solds = await course.get('solds')
                let numbersOfDiscounts = await course.get('numbersOfDiscounts')
                const disc = numbersOfDiscounts - 1 ;
                const final = solds + 1;
                numbersOfDiscounts>0? course.update({ solds: final, numbersOfDiscounts: disc }): null
                //console.log(solds)
                if(emailGift=="undefined"|| emailGift==null){
                    const purchase = await Bought_course.create({
                        courseName: name,
                        courseId: id,
                        owner: emailBuyer,
                        price: price,
                        state: 'bought'
    
                    })
                    purchase.setCourse(course);
                    purchase.setUser(user)

                }else{
                    const gift = await Gift.create({
                        courseId:id,
                        giftEmail:emailGift,
                        payerEmail:emailBuyer
                        })
                        gift.setCourse(course);
                        var mailOptions = {
                            from: emailBuyer,
                            to: emailGift,
                            subject: 'Course gift',
                            text: 'Using code for change your gift! Your code: '+ gift.coupon,
                             html: '<b>That was easy!</b>'
                      
                          };
                          
                          transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('Email sent: ' + info.response);
                            }
                          });
                
                    }

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
            res.send({ msg: "orders destoyed and succes payment" })
        })

})

server.post('/gift/:email', async (req, res) => {
    const emailBuyer = req.params.email;
    const { token, payment_method_id, issuer_id, installments, payer,giftEmail } = req.body
   // const disc = req.body.disc ? req.body.disc : 0;
    const disc = false;
    let discountPercentage;
    const finalDiscounts = [];
    if (!disc) {
        const user = await User.findOne({
            where: {
                email: emailBuyer
            }
        })

        // console.log(emailBuyer)
        let totalPrice = 0;
        const coursesIds = [];
        const fetching = await axios.get(`http://localhost:3001/order/${emailBuyer}`)
            .then(async (curses) => {
                const data = curses.data;
                let response = data.map(async (c) => {
                    const course = await Course.findOne({
                        where: {
                            id: c.coursesId
                        },
                        attributes: ['price', 'id','numbersOfDiscounts','percentageDiscount']
                    })
                    const price = await course.get('price')
                    const id = await course.get('id')
                    const numbersOfDiscounts = await course.get('numbersOfDiscounts')
                    discountPercentage = await course.get('percentageDiscount')
                    
                    const obj = {
                            id:id,
                            discountPercentage:discountPercentage,
                            numbersOfDiscounts:numbersOfDiscounts,
                            price:price
                    }
                    finalDiscounts.push(obj)

                   // totalPrice = totalPrice + price;
                    return (
                        //totalPrice,
                        coursesIds.push(id))
                })
                Promise.all(response).then(async () => {
                   
                   
                    try {
                        let acc = 0;
                        console.log(finalDiscounts)
                        const final = finalDiscounts.map( (c) => {
                            const numbersOfDiscounts =  c.numbersOfDiscounts
                            if (numbersOfDiscounts) {
                                let priceDiscount =c.price - (c.price * (c.discountPercentage / 100))
                                acc = acc + priceDiscount;
                                //console.log("entre", priceDiscount, acc)
                                return acc;

                            }else{ return acc = acc + c.price }
                        })
                      
                        const payment_data = {
                            transaction_amount: acc,
                            token,
                            description: 'payment',
                            installments,
                            payment_method_id,
                            issuer_id,
                            payer
                        }
                        mercadopago.payment
                            .save(payment_data)
                            .then((r) => {
                                if (r.status === 201) {
                                    const destroy = axios.post(`http://localhost:3001/purchase/orders_destroy/${emailBuyer}/?emailGift=${giftEmail}`)

                                }
                                return res.status(r.status).json({
                                    status: r.body.status,
                                    status_detail: r.body.detail,
                                    id: r.body.id
                                })
                            })
                    } catch (e) {
                        return res.status(500).send(e)
                    }
                })
            })
    }
})


module.exports = server
