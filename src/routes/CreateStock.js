const server = require('express').Router()
const { Course, Category, Review, User, Bought_course, Order, Stock } = require('../db');
const axios = require('axios');

server.post('/', async (req, res) => {
    const { amount, percentage } = req.body;
    try {
        const create = await Stock.create({
            active: true,
            amount: amount,
            percentage: 0,percentage
        })
        return res.json(create)
    } catch{
        return res.json({msg: 'Error al crear el descuento'})
    }
})


module.exports = server