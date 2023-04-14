const express = require('express');

const ctrl = require('../../controllers/contacts');

const {validateBody, isValidId} = require('../../middlewares/index');

const {schemas} = require('../../models/contact');

const router = express.Router();


router.get('/', ctrl.getAll );


router.get('/:contactId', isValidId, ctrl.byId );


router.post('/',validateBody(schemas.addSchema), ctrl.add );


router.delete('/:contactId', isValidId, ctrl.remove);

router.put('/:contactId',isValidId, validateBody(schemas.addSchemaForUpdate), ctrl.update);

router.patch('/:contactId/favorite',isValidId, validateBody(schemas.addSchemaForFavoriteUpdate), ctrl.updateStatus);

module.exports = router;
