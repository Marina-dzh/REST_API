const {User} = require("../models/user");

const path = require("path");

const fs = require("fs/promises");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");

const crypto = require("crypto");

const jimp = require("jimp");

const { ctrlWrapper, httpError}= require('../helpers');

const{SECRET_KEY} = process.env;

const avatarDir = path.join(__dirname, '../', 'public','avatars');

const register = async (req, res) =>{
const {email, password} = req.body;

const user = await User.findOne({email});

if(user){throw httpError (409, " Email in use");}


const hashedPassword = await bcrypt.hash(password, 10);

const avatarURL= gravatar.url(email);
    const newUser = await User.create({...req.body, password: hashedPassword, avatarURL});

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

const updateAvatar = async(req, res) =>{
    const {_id}=req.user;

const {path:tempUpload, originalname} = req.file;


const image = await jimp.read(tempUpload);

  await image.resize(250, 250).writeAsync(tempUpload);

const ext = path.extname(originalname);
const baseName = path.basename(originalname, ext);
const uniqSuf = crypto.randomUUID()
const avatarName = `${baseName}_${uniqSuf}${ext}`

const resultUpload = path.join(avatarDir, avatarName);
await fs.rename(tempUpload, resultUpload);
const avatarURL = path.join("avatars", avatarName);
await User.findByIdAndUpdate(_id, {avatarURL});

res.json({
    avatarURL
})
}

module.exports = {
    register:ctrlWrapper(register),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
    updateSub:ctrlWrapper(updateSub),
    updateAvatar:ctrlWrapper(updateAvatar)
}

