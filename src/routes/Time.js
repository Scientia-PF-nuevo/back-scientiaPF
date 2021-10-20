const server = require('express').Router()
const { Course, Category, Review , User, Bought_course, Order} = require('../db');
const axios = require ('axios');
const { response } = require('express');

server.put('/:email', async (req, res) => {
    const { duration, videoTime, playing, video } = req.body

    Bought_course.update()
});