import express from 'express'
const Router=express.Router()
import { sendVerifyCode ,verifyPhoneNumber} from '../Controllers/phoneVerify.js'
import {downLoad,upLoad} from '../Controllers/fileController.js'
import multer from "multer"
import { verifyUser } from '../utils/verifyToken.js'
import path from 'path'
const upload = multer({ dest: 'assets/' });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'assets/backgroundimage'); // Save files to public/images directory
    },
    filename: function (req, file, cb) {
      
      cb(null, "background.png"); // Set filename to fieldname-currentTimestamp.extension
    }
  });
  const uploadBackground = multer({ storage: storage });
Router.post("/sendPhoneNumber",sendVerifyCode)
Router.post("/verifyPhoneNumber",verifyPhoneNumber)
Router.post("/upload-avatar",upload.single('avatar'),downLoad)
Router.get("/download-avatar",verifyUser,upLoad)
Router.post("/upload-background",uploadBackground.single('background'),(req, res) => {
    if (!req.file) {
    return res.status(400).json({message:'No file uploaded.'});
    }

    // Do something with the uploaded file
    console.log(`Uploaded file: ${req.file.filename}`);

    res.json({message:'File uploaded successfully.'});
})
Router.get("/download-background",(req,res)=>{
    try{
        const absolutePath=process.cwd()+"\\assets\\backgroundimage\\background.png"
        console.log(absolutePath)
        res.status(200).sendFile(absolutePath)
    }catch(err){
        console.log(err)
    }
})
export default Router