const fs = require('fs/promises')
const path = require("path")
const {nanoid} = require ("nanoid")

const contactsPath = path.join(__dirname, "contacts.json")


async function readContacts(){
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data)
 
}

function updateContacts (contacts){
  return fs.writeFile(contactsPath, JSON.stringify(contacts), "utf8");
}

const listContacts = function(){
  return readContacts()
}


const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contact = contacts.find(contact => contact.id===contactId);
  return contact;
}

const removeContact = async (contactId) => {
  const contacts = await readContacts();
    const newContacts = contacts.filter(contact=>contact.id!==(contactId));
    const deletedCon = contacts.filter(contact=>contact.id===(contactId))
    if(!deletedCon.length){
      return null
    }
    await updateContacts(newContacts);
    return deletedCon;
  }

const addContact = async (contact) => {const contacts = await readContacts();
  const newContact = {...contact, id:nanoid(8)}
  contacts.unshift(newContact);
 await updateContacts(contacts);
 return newContact}

const updateContact = async (id, body) => {
  const contacts = await readContacts();
  const index = contacts.findIndex(contact => contact.id===id);
  console.log(index)
  if(index===-1){
    return null;
  }
  contacts[index]={id, ...body}
  await updateContacts(contacts);
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
