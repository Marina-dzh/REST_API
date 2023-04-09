const express = require('express')
const contacts = require("../../models/contacts")
const {httpError}= require('../../helpers')
const Joi = require('joi')

const router = express.Router()


const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
})

const addSchemaForUpdate = Joi.object({
  id:Joi.string(),
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string()
})

router.get('/', async (req, res, next) => {
try{

  const result = await contacts.listContacts() 
  res.json(result)
}
catch(err){
  err.message = "Server error, try again later"
  next(err)
  
}})


router.get('/:contactId', async (req, res, next) => {
  try{
  const contactId = req.params.contactId;
  const result = await contacts.getContactById(contactId)
  if(!result){
   throw httpError(404, "Contact not found")
  }
  res.json(result)}
  catch(err){
    next(err)
  
}})


router.post('/', async (req, res, next) => {
  try{
    const {error} = addSchema.validate(req.body)
    if(error){
      throw httpError(400, error.message)
    }
const result = await contacts.addContact(req.body);
res.status(201).json(result)
  }
  catch(err){
    next(err)
  }
})


router.delete('/:contactId', async (req, res, next) => {
  try {
    const {contactId}= req.params

    const result = await contacts.removeContact(contactId)

    if(!result){
      throw httpError(404, "Contact not found")
    }
    res.status(200).json({message:"Contact deleted"})
  } catch (error) {
    next(error)
  }

})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = addSchemaForUpdate.validate(req.body)
    if(error){
      throw httpError(400, error.message)
    }
    
    const {contactId}= req.params
    
    const result = await contacts.updateContact(contactId, req.body)
    if(!result){
      throw httpError(404, "Contact not found")
    }
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router
