"use strict";
const express = require('express');
const UserModel = require('./model/userSchema');
const mongoose = require('mongoose');
const awsHandler = require('./aws');
const multer = require("multer");


const dotenv = require('dotenv');
dotenv.config();

// Set up port for server to listen on
let port = process.env.PORT || 8100;

/*express is using create a http server*/
const app = express();
app.use(express.json());
app.use(bodyParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// connect to mongodb


mongoose.connect(`${process.env.DB_URI}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
    });

    const storage = multer.memoryStorage();
    const upload = multer({
      storage,
    });
// //routes
app.get('/', (req, res) => {
    res.status(200).send({ Message: 'Connected', status: 200 });
});
app.post(
    "/video",
upload.single("video"),
    async (req, res) => {
        const { video } = req.body;
        if (video !== '' && req.file !== undefined) {
            awsHandler.UploadToAws(req.file)
                .then((image) => {
                    console.log(image)
                    const User = new UserModel({
                        video: image,

                    });
                     console.log(User);
                    User.save()
                        .then((SavedUser) => {
                            console.log(SavedUser);
                            return res.status(200).send({
                                Message: 'Video added Successfully.',
                                SavedUser,
                            });
                        })
                        .catch((err) => {
                            res.status(500);
                            next(
                                new Error(
                                    `Unable to add video. Please Try later. ${err}`,
                                ),
                            );
                        });
                });
        }
    })
    app.get("/getVideo", async (req, res) => {
        UserModel.find({})
        .then((video) => {
            res.status(200).json(video);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
      });



//Listing port
// Fire up server
// Print friendly message to console
app.listen(port, () => {
    console.log('app started at port 8100');
});