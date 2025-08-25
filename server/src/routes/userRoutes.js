
const express = require('express');
const userRoutes = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

userRoutes.get('/cutomers',async(req,res)=>{
    try {
        const responce = await User.find() 
        console.log(responce)
        res.status(200).json({data:responce , message:"Customer Data" }) 

    } catch (error) {

        console.log("Error",error)

    }
})


userRoutes.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        // console.log("user info", user.userId);

        const response = await User.findOne({ _id: user.userId });

        if (!response) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ data: response, message: "User Profile Data" });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = userRoutes