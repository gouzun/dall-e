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
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
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
    try {
      const { name, prompt, photo } = req.body;
      const photoUrl = await cloudinary.uploader.upload(photo);
  
      const newPost = await Post.create({
        name,
        prompt,
        photo: photoUrl.url,
      });
  
      res.status(200).json({ success: true, data: newPost });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
    }
  });

// router.route('/').post(async (req, res) => {
//     console.log("Req ",req)
//     try {
//         const parser = new datauri();
        
//         console.log("postroute");
//         const { name, prompt, photo } = req.body;
//         const buffer = Buffer.from(photo.replace(/^data:image\/\w+;base64,/, ''), 'base64');

//         console.log("uploadeding");
//         // const photoUrl = await cloudinary.uploader.upload(photo);
//         cloudinary.uploader.upload_stream((error, result) => {
//             if (error) {
//               console.log(error);
//               res.status(500).json({ success: false, message: 'Unable to upload image to Cloudinary' });
//             } else {
//               console.log(result.secure_url);
              
//               res.status(200).json({ success: true, data: newPost });
//             }
            
//           }).end(buffer);
//           const newPost = await Post.create({
//             name,
//             prompt,
//             photo: result.secure_url,
//           });
//           console.log("done uploadeding");
//     } catch (err) {
//         res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
//     }
// });

export default router;