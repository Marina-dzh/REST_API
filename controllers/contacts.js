const {Contact} = require("../models/contact");

const {httpError, ctrlWrapper}= require('../helpers');

const getAll = async (req, res) => {
   
      const result = await Contact.find() ;
      if(!result){
        throw httpError(500, "Server error, try again later");
       }
      res.json(result);
    }


const add = async (req, res) => {
 console.log(req.body);
    const result = await Contact.create(req.body);
    res.status(201).json(result);
    }


const byId = async (req, res) => {
        
        const {contactId} = req.params;
        const result = await Contact.findById(contactId);
        if(!result){
         throw httpError(404, "Contact not found");
        }
        res.json(result);
    }
       

const remove = async (req, res) => {

          const {contactId}= req.params;
          const result = await Contact.findByIdAndDelete(contactId);
      
          if(!result){
            throw httpError(404, "Contact not found");
          }
          res.status(200).json({message:"Contact deleted"});
       
      }


      const update = async (req, res) => {

          
          const {contactId}= req.params;
          
          const result = await Contact.findByIdAndUpdate(contactId, req.body, {new:true});
          if(!result){
            throw httpError(404, "Contact not found");
          }
          res.status(200).json(result);
        
      }

      const updateStatusContact = async (req, res) => {
        const {contactId}= req.params;
        
        const result = await Contact.findByIdAndUpdate(contactId, req.body, {new:true});
        if(!result){
          throw httpError(404, "Contact not found");
        }
        res.status(200).json(result);
    }


module.exports = {
        getAll:ctrlWrapper(getAll),
        byId:ctrlWrapper(byId),
        add:ctrlWrapper(add),
        remove:ctrlWrapper(remove),
        update:ctrlWrapper(update),
        updateStatus:ctrlWrapper(updateStatusContact),

    };


