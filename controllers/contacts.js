const {Contact} = require("../models/contact");

const {httpError, ctrlWrapper}= require('../helpers');

const getAll = async (req, res) => {

  const {_id: owner}=req.user 

  let filter ={owner}

  const {page = 1, limit = 20, favorite}= req.query;
  const skip=(page-1)*limit;

if(favorite){
   filter={owner, favorite}
}

      const result = await Contact.find(filter, "", {skip, limit}) ;
      if(!result){
        throw httpError(500, "Server error, try again later");
       }
      res.json(result);
    }


const add = async (req, res) => {
  
const {_id: owner}=req.user 

    const result = await Contact.create({...req.body, owner});
    res.status(201).json(result);
    }


const byId = async (req, res) => {
  const {_id: owner}=req.user 
  console.log(owner)
        const {contactId} = req.params;

        const result = await Contact.findOne({_id:contactId, owner: owner});
        console.log(result)
        if(!result){
         throw httpError(404, "Contact not found");
        }
        res.json(result);
    }
       

const remove = async (req, res) => {
  const {_id: owner}=req.user 
          const {contactId}= req.params;
          const result = await Contact.findOneAndDelete({_id:contactId, owner: owner});
      
          if(!result){
            throw httpError(404, "Contact not found");
          }
          res.status(200).json({message:"Contact deleted"});
       
      }


      const update = async (req, res) => {
        const {_id: owner}=req.user 
          
          const {contactId}= req.params;
          
          const result = await Contact.findOneAndUpdate({_id:contactId, owner: owner}, req.body, {new:true});
          if(!result){
            throw httpError(404, "Contact not found");
          }
          res.status(200).json(result);
        
      }

      const updateStatusContact = async (req, res) => {
        const {_id: owner}=req.user 
        const {contactId}= req.params;
        
        const result = await Contact.findOneAndUpdate({_id:contactId, owner: owner}, req.body, {new:true});
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


