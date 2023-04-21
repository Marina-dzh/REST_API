const express = require('express');

const ctrl = require('../../controllers/contacts');

const {validateBody, isValidId, authenticate} = require('../../middlewares/index');

const {schemas} = require('../../models/contact');

const router = express.Router();


router.get('/', authenticate, ctrl.getAll );


router.get('/:contactId',authenticate, isValidId, ctrl.byId );


router.post('/',authenticate,validateBody(schemas.addSchema), ctrl.add );

router.delete('/:contactId',authenticate, isValidId, ctrl.remove);

router.put('/:contactId',authenticate,isValidId, validateBody(schemas.addSchemaForUpdate), ctrl.update);

router.patch('/:contactId/favorite',authenticate,isValidId, validateBody(schemas.addSchemaForFavoriteUpdate), ctrl.updateStatus);


module.exports = router;

