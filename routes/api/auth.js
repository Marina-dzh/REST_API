const express= require('express');

const ctrl = require('../../controllers/auth');

const {validateBody, authenticate} = require('../../middlewares/index');

// isValidId
const {schemas} = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);
 
router.post('/logout', authenticate, ctrl.logout);
router.patch('/subscription',authenticate,validateBody(schemas.updateSubSchema), ctrl.updateSub )

module.exports = router;
