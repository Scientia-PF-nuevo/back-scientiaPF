const server = require('express').Router()
const { Course, Category, Review, User, Bought_course, Order, Gift } = require('../db');
const axios = require('axios');
const mercadopago = require('mercadopago');
const ejs = require('ejs');
const path = require('path');
// const token = 'TEST-5014021276587978-102020-2aa0263c739b5941b77085e513aa6fad-90743208';
const giftEmailTemp = path.join(__dirname, '../templates/index.ejs')
//const boughtEmailTemp = path.join(__dirname, '../templates/boughtCourse.ejs')
mercadopago.configure({
    access_token: 'TEST-5014021276587978-102020-2aa0263c739b5941b77085e513aa6fad-90743208'
});
const dot = require('dotenv')
//localhost:3001/purchase/
const redirectLogin = require('../middleware/redirectLogin');
var transporter = require('../mailer/mailer'); 

dot.config()
axios.defaults.baseURL = 'http://localhost:3001';

var local = "";

if(process.env.PORT == 3001){
  local = "http://localhost:3001";
}else{
  local = "https://scientiapfdeploy.herokuapp.com";
}



server.post('/:email', async (req, res) => {
    console.log('COMPRANDO')
    console.log('COMPRANDO')
    console.log('COMPRANDO')
    console.log('COMPRANDO')
    console.log('COMPRANDO')
    console.log('COMPRANDO')
    const email = req.params.email;
    const { token, payment_method_id, issuer_id, installments, payer,orders } = req.body
    
   // const disc = req.body.disc ? req.body.disc : 0;
   try {
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
        const fetching = await axios.get(`/order/${email}`)
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
                   // destroyOrders(email, orders)
                    // destroyOrders(email, orders)      
                    try {
                        let acc = 0;
                        // console.log(finalDiscounts)
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
                            .then(async(r) => {
                                console.log('---------')
                                console.log('---------')
                                console.log('--------------------------------',r.status)
                                console.log(r.status)
                                console.log(r)
                                

                                    // orders.length>1? payload =orders : payload={}
                                // const destroy = axios.post(`${local}/purchase/orders_destroy/${email}`,{Giftorders: orders})
                                  
                                
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
   } catch (error) {
       res.send(error)
   }

})

server.post('/orders_destroy/:emailBuyer', async (req, res) => {
    
    console.log('DESTRUYENDO')
    console.log('DESTRUYENDO')
    console.log('DESTRUYENDO')
    console.log('DESTRUYENDO')
    console.log('DESTRUYENDO')
    const {emailBuyer} = req.params;
    const {Giftorders} = req.body;
    // console.log(orders)
    try {
        const user = await User.findOne({
            where: {
                email: emailBuyer
            }
        })
        //const {emailGift} = req.query;
        let gifts = Giftorders.map(async(o)=>{
            // console.log(o.gift)
            if(o.gift){
                const course = await Course.findOne({
                    where: {
                        id: o.courseId
                    }       
                })
                
                let solds =  course.solds    
                let numbersOfDiscounts =  course.numbersOfDiscounts
                const disc = numbersOfDiscounts - 1 ;
                const final = solds + 1;
                numbersOfDiscounts>0? course.update({ solds: final, numbersOfDiscounts: disc }): null
        
                
                    
                    const gift = await Gift.create({
                        courseId:course.id,
                        giftEmail:o.emailGift,
                        payerEmail:emailBuyer 
                        })
                        gift.setCourse(course);
                        
                        const giftEmail= o.emailGift
                        const name = user.name
                        const subject= 'You have a gift on scientia!'
                        const emailData = {giftEmail,subject,user,course,gift} ;
                        const html = await ejs.renderFile(giftEmailTemp,emailData)

                        // console.log(gift)
                        var mailOptions = {
                        from: user.name,
                        to: giftEmail,
                        subject: 'Course gift',
                        text: 'Using code for change your gift!',
                        html: html
                        
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response +o.emailGift);
                            }
                        });
                //}
                const del = async () => {
                    const findUserOrder = await Order.findOne({
                        where: {
                            id: o.orderId
                        }, includes: [Order]
                    });
                    await findUserOrder.destroy();
                }
                return del()
                
            }
        })
        let coursesToSend = []
        Promise.all(gifts).then(async()=>{        
            const orders = await Order.findAll({
                where: {
                    userEmail: emailBuyer
                },includes:[Course]
            })
            
            orders.map(async(o)=>{
                // console.log(o)
                const course = await Course.findOne({
                    where: {
                        id: o.coursesId
                    }
                    // attributes: ['price', 'id', 'name', "solds", "numbersOfDiscounts"]
            
                })    
                coursesToSend.push(course.name)
                let solds =  course.solds
        
                let numbersOfDiscounts =  course.numbersOfDiscounts
                const disc = numbersOfDiscounts - 1 ;
                const final = solds + 1;
                numbersOfDiscounts>0? course.update({ solds: final, numbersOfDiscounts: disc }): null
                
        
                const purchase = await Bought_course.create({
                courseName: course.name,
                courseId: o.coursesId,
                owner: emailBuyer,
                price: course.price,
                state: 'bought'
            
                        })
            purchase.setCourse(course);
            purchase.setUser(user)
            

            
            
            
        
            const del = async () => {
                const findUserOrder = await Order.findOne({
                    where: {
                        id: o.id
                    }, includes: [Order]
                });
                // console.log(findUserOrder)
                await findUserOrder.destroy();
            }
            del()
            })
            
            
            res.send({ msg: "orders destoyed and succes payment" })
        })
        
    } catch (error) {
        res.send(error)
    }


})

server.post("/freecourses/:email/:id", async(req,res)=>{
    
const {email, id } = req.params;

  try {
    if(email && id){
        const user = await User.findOne({
        where: {
            email: email
        }
    })
    const course = await Course.findOne({
        where: {
            id: id
        }
    })

    const freePurchase = await Bought_course.create({
        courseName: course.name,
        courseId: id,
        owner: email,
        price: course.price,
        state: 'bought'
    
                })
        freePurchase.setCourse(course);
        freePurchase.setUser(user)
    res.send("free course succes")
}
    else{
        res.send("not id or email")
    }
  } catch (error) {
     res.send(error) 
  }

})

const destroyOrders = async(emailBuyer, Giftorders)=>{
    //const {emailBuyer} = req.params;
    //const {Giftorders} = req.body;
    // console.log(orders)

    console.log('DESTRUYENDO')
    console.log('DESTRUYENDO')
    console.log('DESTRUYENDO')
    console.log('DESTRUYENDO')
    console.log('DESTRUYENDO')
    try {
        const user = await User.findOne({
            where: {
                email: emailBuyer
            }
        })
        //const {emailGift} = req.query;
        let gifts = Giftorders.map(async(o)=>{
            // console.log(o.gift)
            if(o.gift){
                const course = await Course.findOne({
                    where: {
                        id: o.courseId
                    }       
                })
                
                let solds =  course.solds    
                let numbersOfDiscounts =  course.numbersOfDiscounts
                const disc = numbersOfDiscounts - 1 ;
                const final = solds + 1;
                numbersOfDiscounts>0? course.update({ solds: final, numbersOfDiscounts: disc }): null
        
                
                    
                    const gift = await Gift.create({
                        courseId:course.id,
                        giftEmail:o.emailGift,
                        payerEmail:emailBuyer 
                        })
                        gift.setCourse(course);
                        
                        const giftEmail= o.emailGift
                        const name = user.name
                        const subject= 'You have a gift on scientia!'
                        const emailData = {giftEmail,subject,user,course,gift} ;
                        const html = await ejs.renderFile(giftEmailTemp,emailData)

                        // console.log(gift)
                        var mailOptions = {
                        from: user.name,
                        to: giftEmail,
                        subject: 'Course gift',
                        text: 'Using code for change your gift!',
                        html: html
                        
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response +o.emailGift);
                            }
                        });
                //}
                const del = async () => {
                    const findUserOrder = await Order.findOne({
                        where: {
                            id: o.orderId
                        }, includes: [Order]
                    });
                    await findUserOrder.destroy();
                }
                return del()
                
            }
        })
        let coursesToSend = []
        Promise.all(gifts).then(async()=>{        
            const orders = await Order.findAll({
                where: {
                    userEmail: emailBuyer
                },includes:[Course]
            })
            
            orders.map(async(o)=>{
                // console.log(o)
                const course = await Course.findOne({
                    where: {
                        id: o.coursesId
                    }
                    // attributes: ['price', 'id', 'name', "solds", "numbersOfDiscounts"]
            
                })    
                coursesToSend.push(course.name)
                let solds =  course.solds
        
                let numbersOfDiscounts =  course.numbersOfDiscounts
                const disc = numbersOfDiscounts - 1 ;
                const final = solds + 1;
                numbersOfDiscounts>0? course.update({ solds: final, numbersOfDiscounts: disc }): null
                
        
                const purchase = await Bought_course.create({
                courseName: course.name,
                courseId: o.coursesId,
                owner: emailBuyer,
                price: course.price,
                state: 'bought'
            
                        })
            purchase.setCourse(course);
            purchase.setUser(user)
            

            
            
            
        
            const del = async () => {
                const findUserOrder = await Order.findOne({
                    where: {
                        id: o.id
                    }, includes: [Order]
                });
                // console.log(findUserOrder)
                await findUserOrder.destroy();
            }
            del()
            })
            
            
           return console.log({ msg: "orders destoyed and succes payment" })
        })
        
    } catch (error) {
        return console.log(error)
    }
}

module.exports = server
