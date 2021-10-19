const server = require('express').Router()
const { Course, Category, Review , User} = require('../db');
const axios = require ('axios')

server.post('/:email', async (req, res) => {
    const email = req.params.email
    const fetching = axios.get(`http://localhost:3001/order/${email}`)
})

module.exports = server
