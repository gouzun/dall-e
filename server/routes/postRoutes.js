import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import datauri from 'datauri/parser.js';
import streamifier from 'streamifier';

import Post from '../mongodb/model/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.route('/').get(async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
    }
});

router.route('/').post(async (req, res) => {
    console.log("Req ",req)
    try {
        const parser = new datauri();
        

        console.log("postroute");
        const { name, prompt, photo } = req.body;
        const buffer = parser.format('.jpg', photo).content;
        console.log("uploadeding");
        // const photoUrl = await cloudinary.uploader.upload(photo);
        const uploadStream = cloudinary.uploader.upload_stream({ folder: 'my_folder' }, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
            }
          });
          streamifier.createReadStream(buffer).pipe(uploadStream);
console.log("uploaded");
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url,
        });

        res.status(200).json({ success11: true, data: newPost });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
    }
});

export default router;