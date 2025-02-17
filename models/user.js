const {Schema, model}= require('mongoose');
const {handleMongooseError} = require('../helpers');

const Joi = require('joi');

 const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const userSchema = new Schema(   
{
    password: {
      type: String,
      required: [true, 'Set password for user'],
      minlength: [6, 'Password must be at least 6 characters long'],
      // select: false
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match:[emailRegex, 'Please enter a valid email address']
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String,
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  }, {versionKey:false, timestamps:false })




  userSchema.post('save', handleMongooseError);


const registerSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    subscription: Joi.string().valid("starter", "pro", "business")
})

const loginSchema = Joi.object({
    
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
   
})

const updateSubSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required()
})

const emailSchema = Joi.object({
  email: Joi.string().required().email()
})

  const schemas = {registerSchema,loginSchema, updateSubSchema, emailSchema};
  const User = model('user', userSchema);

module.exports = {User, schemas};