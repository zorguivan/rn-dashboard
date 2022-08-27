const express = require('express')
const router = express.Router()
const Hotels = require('../models/Hotels')

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const fs = require('fs');
const sharp = require('sharp');
const path = require('path');


router.get('/hotels', (req, res) => {
    Hotels.find()
        .then(hotels => {
            if (!hotels) {
                return res.status(400).json({ msg: 'No Hotels found' })
            } else {
                console.log(hotels)
                res.send(hotels)
            }
        })
        .catch(err => res.json({ msg: 'Server error' }))
});

router.get('/hotels/:id', (req, res) => {

    Hotels.find({ _id: req.params.id })
        .then(hotel => {
            if (!hotel) {
                return res.status(400).json({ msg: 'No Hotels found' })
            } else {
                res.send(hotel)
            }
        })
        .catch(err => res.json({ msg: 'Server error' }))
});

router.post('/hotel', (req, res) => {
    const { name, description, image, location } = req.body;
    let creationDate = new Date();
    let rooms = [];
    req.body.rooms.forEach((room) => rooms.push(room.text));
    //console.log(rooms)
    const obj = new Hotels({ name, description, image, location, rooms });

    obj.save(function (err) {
        if (err) {
            res.status(500)
            res.json(err)
            return;
        }
        res.status(200)
        res.json(obj)
    });
});

router.delete('/hotel/:id', (req, res) => {
    Hotels.findById(req.params.id)
        .then(zone => {
            var imageLink = zone.image.replace("https://dashboard.toppstation.com/","uploads/")
            try {
                fs.unlinkSync(imageLink)
                //file removed
              } catch(err) {
                console.error(err)
              }
            //fs.unlink(imageLink)
            console.log(zone)
            if (!zone) {
                return res.json({ msg: 'Hotel not found' })
            } else {
                Hotels.findByIdAndDelete(req.params.id, (err, data) => {
                    res.json({ msg: "Hotel has been Deleted" })
                })
            }
        })
        .catch(err => console.log(err.message))
})

//Upload Image
const DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    //limits: { fieldSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// Hotel model
router.post('/hotel-image', upload.single('image'), async (req, res) => {
    console.log(req.body)
    let creationDate = new Date();
    const url = req.protocol + '://' + req.get('host')
    let roomsList = JSON.parse(req.body.rooms)
    let rooms = [];
    roomsList.forEach((room) => rooms.push(room));

    await sharp(req.file.path)
    .resize(592, 339)
    .jpeg({ quality: 90 })
    .toFile(
        path.resolve(req.file.destination + "cover" + req.file.filename)
    ).toString();

    const hotel = new Hotels({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        image: url + '/' + req.file.filename,
        coverImage : url + '/cover' + req.file.filename,
        rooms: rooms,
    });
    hotel.save().then(result => {
        res.status(201).json({
            message: "Hotel registered successfully!",
            hotelCreated: {
                _id: result._id,
                image: result.image
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})



//Update
router.put('/hotel/:id',upload.single('image'), async (req, res) => { 
    let roomsList = JSON.parse(req.body.rooms)
    let rooms = [];
    roomsList.forEach((room) => rooms.push(room));
    const url = req.protocol + '://' + req.get('host');

    if(req.file && req.file.path){
        await sharp(req.file.path)
        .resize(592, 339)
        .jpeg({ quality: 90 })
        .toFile(
            path.resolve(req.file.destination + "cover" + req.file.filename)
        ).toString();
    }

    let hotelFields = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        rooms: rooms,
    }
    let imageDeleteOrder = false;
    if (req.file && req.file.filename){
        imageDeleteOrder = true;
        hotelFields.image = url + '/' + req.file.filename
        hotelFields.coverImage = url + '/cover' + req.file.filename;
    }
    Hotels.findById(req.params.id)
        .then(hotel => {
            
            console.log(hotel.image)
            console.log(hotel.coverImage)
            var imageLink = hotel.image.replace("http://localhost:5009/","./uploads/")
            // var coverLink = hotel.coverImage.replace("http://localhost:5009/","./uploads/")
            try {
                if(imageDeleteOrder){
                    fs.unlinkSync(imageLink)
                }
                //file removed
              } catch(err) {
                console.error(err)
              }
            if (!hotel) {
                return res.json({ msg: 'Hotel not found' })
            } else if (hotel.id !== req.params.id) {
                res.json({ msg: "not authorized" })
            } else {
                Hotels.findByIdAndUpdate(req.params.id, { $set: hotelFields }, (err, data) => {
                    res.json({ msg: "Hotel has been updated" })
                })
            }
        })
        .catch(err => console.log(err.message))
        
})
module.exports = router