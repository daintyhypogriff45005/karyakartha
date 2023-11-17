const express = require("express");
const router = express.Router();
const { query,body, validationResult } = require('express-validator');
const User = require("../Schema/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

// create user
router.post("/createUser",[
    body('email',"enter a valid email").notEmpty().isEmail(),
    body('password',"enter a valid password").isLength({min:8})
  ], async (req, res) => {
    let success=false;
    try {
      const result = validationResult(req);
    if (result.isEmpty()){
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hashSync(req.body.password, salt)
      const user = new User({
        email:req.body.email,
        password:hash,
      });
      const data = {
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET)
      await user.save();
      success=true;
      res.json({success,authToken});
      console.log('User created successfully');
    }
    else{
      res.send({ "validation errors": result.array() });
    }
    } catch (error) {
      if (error.message.includes('duplicate key error')) {
        console.error('Duplicate key error:', error);
        res.status(400).json({success,error: "Email already exists" });}
         else {
        console.error('Error creating user:', error);
        res.status(500).json({success, error: "Internal server error"});
      }
    }
  });

// user login

router.post("/login",[
    body('email',"enter a valid email").isEmail(),
    body('password',"password can't be blank").exists()
  ], async (req, res) => {
    let success=false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({error:"Enter right credentials"});
    }
    const {email,password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"Enter proper credentials"});
      }
      const passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        return res.status(400).json({success,error:"Enter proper credentials"});
      }
      const data = {
        user:{
          id: user.id,
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET)
      success=true;
      res.json({success,authToken});
      console.log("login successful with authToken");
      console.log("Welcome");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
  })




module.exports = router;