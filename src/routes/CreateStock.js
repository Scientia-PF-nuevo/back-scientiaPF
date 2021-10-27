const server = require('express').Router()
const { Course, Category, Review, User, Bought_course, Order, Stock } = require('../db');
const axios = require('axios');

server.post('/', async (req, res) => {
    const { amount, percentage } = req.body;
    try {
        const create = await Stock.create({
            active: true,
            amount: amount,
            percentage: percentage
        })
        return res.json(create)
    } catch{
        return res.json({msg: 'Error al crear el descuento'})
    }
})

server.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const search = await Stock.findOne({ where: { id: id } });
        if (search === null) {
            return res.status(204).json({msg: 'El descuento no existe o ya fue utilizado demasiadas veces'})
        } else{
            return res.json(search)
        }
    }
    catch{
        return res.json({msg: 'Error al buscar el descuento'})
    }
});


module.exports = server