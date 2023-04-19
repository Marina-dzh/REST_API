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
console.log(
    "36", user.email
)
if(!user){
    throw httpError(401, "Email or password is wrong");
}
console.log(
    "39", user.password, password
)
const passwordCompare = await bcrypt.compare(password, user.password);
console.log(
    "43",passwordCompare
)
if(!passwordCompare){
    throw httpError(401, "Email or password is wrong");
}

const payload = {
    id:user._id,
}
console.log(
    "53", payload
)
const token = jwt.sign(payload, SECRET_KEY,{expiresIn:"6h"} )
res.json({
    token})

}


module.exports = {
    register:ctrlWrapper(register),
    login:ctrlWrapper(login)
}

