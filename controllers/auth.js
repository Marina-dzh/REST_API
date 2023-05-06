const {User} = require("../models/user");

const path = require("path");

const fs = require("fs/promises");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");

const crypto = require("crypto");

const jimp = require("jimp");

const { ctrlWrapper, httpError, sendEmail}= require('../helpers');

const {nanoid} = require("nanoid");

const{SECRET_KEY, BASE_URL} = process.env;

const avatarDir = path.join(__dirname, '../', 'public','avatars');

const register = async (req, res, next) =>{
const {email, password} = req.body;

const user = await User.findOne({email});

if(user){next( httpError (409, " Email in use"));}


const hashedPassword = await bcrypt.hash(password, 10);

const avatarURL= gravatar.url(email);

const verificationToken = nanoid()

const newUser = await User.create({...req.body, password: hashedPassword, avatarURL, verificationToken});


const verifyEmail = {
    to:email,
    subject:"Verify your email",
    html:`<a target="_blank" href = "${BASE_URL}/api/users/verify/${verificationToken}" >Click verify</a>`
}

await sendEmail(verifyEmail)

    res.status(201).json({
        email: newUser.email,
        subscription:newUser.subscription,
        
       
    })
}

const verifyEmail= async(req, res, next)=>{
const {verificationToken} = req.params;
const user = await User.findOne({verificationToken});

if(!user){
    next( httpError(404, "User not found"))
}

await User.findOneAndUpdate(user._id,{verify:true, verificationToken:null})
res.status(200).json({message:"Verification successful"})

}

const resendVerifyEmail = async (req, res, next) => {
    
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        next( httpError(404, "User not found"))
    }

    if(user.verify){
        next( httpError(400, "Verification has already been passed"))
    }

    const verifyEmail = {
        to:email,
        subject:"Verify your email",
        html:`<p>Click <a target="_blank" href = "${BASE_URL}/api/users/verify/${user.verificationToken}" > here </a> to verify your email! </p>`
    }
    await sendEmail(verifyEmail);

    res.status(200).json({message:"Verification email sent"})
}

const login = async (req, res, next) =>{

const {email, password} = req.body;
const user = await User.findOne({email});

if(!user){
    next( httpError(401, "Email or password is wrong"));
}

if(!user.verify){
    next( httpError(404, "User not found"));
}

const passwordCompare = await bcrypt.compare(password, user.password);

if(!passwordCompare){
    next( httpError(401, "Email or password is wrong"));
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



const getCurrent = async(req, res, next) =>{
const {email, subscription} = req.user;
res.status(200).json({email, subscription})
}



const logout= async(req, res, next) =>{
const {_id}=req.user;
await User.findByIdAndUpdate(_id, {token:""})
res.status(204).json({message:"Logout success"})
}

const updateSub= async(req, res, next) =>{
   
    const {_id}=req.user;
await User.findByIdAndUpdate(_id, req.body,{new:true})
res.status(200).json({message:`Subscription updated to "${req.body.subscription}`})

}

const updateAvatar = async(req, res, next) =>{
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
    verifyEmail:ctrlWrapper(verifyEmail),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
    updateSub:ctrlWrapper(updateSub),
    updateAvatar:ctrlWrapper(updateAvatar),
    resendVerifyEmail:ctrlWrapper(resendVerifyEmail)
}

