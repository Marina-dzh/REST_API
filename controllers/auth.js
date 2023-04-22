const {User} = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { ctrlWrapper, httpError}= require('../helpers');

const{SECRET_KEY} = process.env;


const register = async (req, res) =>{
const {email, password} = req.body;

const user = await User.findOne({email});

if(user){throw httpError (409, " Email in use");}


const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashedPassword});

    res.status(201).json({
        email: newUser.email,
        subscription:newUser.subscription,
        
       
    })
}


const login = async (req, res) =>{

const {email, password} = req.body;
const user = await User.findOne({email});

if(!user){
    throw httpError(401, "Email or password is wrong");
}

const passwordCompare = await bcrypt.compare(password, user.password);

if(!passwordCompare){
    throw httpError(401, "Email or password is wrong");
}

const payload = {
    id:user._id,
}
const subscription =user.subscription
const token = jwt.sign(payload, SECRET_KEY,{expiresIn:"6h"} );
await User.findByIdAndUpdate(user._id, {token});
res.json({
    token, email, subscription})

}



const getCurrent = async(req, res) =>{
const {email, subscription} = req.user;
res.status(200).json({email, subscription})
}



const logout= async(req, res) =>{
const {_id}=req.user;
await User.findByIdAndUpdate(_id, {token:""})
res.status(204).json({message:"Logout success"})
}

const updateSub= async(req, res) =>{
   
    const {_id}=req.user;
await User.findByIdAndUpdate(_id, req.body,{new:true})
res.status(200).json({message:`Subscription updated to "${req.body.subscription}`})

}


module.exports = {
    register:ctrlWrapper(register),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
    updateSub:ctrlWrapper(updateSub)
}

