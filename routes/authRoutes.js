const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js');
const router = express.Router();

// Register 
router.post('/register', async (req,res) => {
const{username , email, password} = req.body;
try{
    let user = await User.findOne({email});
    if(user){
        return res.status(400).json({message: 'User already exists'});
    }


    const hashed = await bcrypt.hash(password,10);
    user = new User({username, email, password: hashed});
    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({token ,  message: 'User registered' });

   
}catch(err){
    res.status(500).json({error : err});
}
})

// Login
router.post('/login' , async (req,res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid email'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid password'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn : '1h'});
    
        res.json({token, user:{id: user._id, username: user.username, email: user.email}});
    
    
    }catch(err){
        res.status(500).json({message: err});
    }
})


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};


router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('username email ');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            username: user.username,
            email: user.email,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
