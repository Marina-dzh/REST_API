
const {Schema, model}= require('mongoose');
const {handleMongooseError} = require('../helpers');

const Joi = require('joi');

const phoneRegexp = /^\(\d{3}\)(|\s)\d{3}-\d{4}$/ ;
const phoneRegexpMessage = '(000)000-0000';

const contactSchema = new Schema(  {
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
}, {versionKey:false, timestamps:false });


contactSchema.post('save', handleMongooseError);


const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(phoneRegexp,phoneRegexpMessage).required(),
  favorite: Joi.boolean()
});

const addSchemaForUpdate = Joi.object({
  id:Joi.string(),
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(phoneRegexp,phoneRegexpMessage),
  favorite: Joi.boolean()
});
const addSchemaForFavoriteUpdate = Joi.object({
  id:Joi.string(),
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(phoneRegexp,phoneRegexpMessage),
  favorite: Joi.boolean().required().messages({'any.required':'missing field favorite'})
});

const schemas = {addSchema, addSchemaForUpdate,addSchemaForFavoriteUpdate};


const Contact = model('contact', contactSchema);

module.exports = {Contact, schemas};
