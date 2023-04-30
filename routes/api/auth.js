const express= require('express');

const ctrl = require('../../controllers/auth');

const {validateBody, authenticate, upload} = require('../../middlewares/index');


// isValidId
const {schemas} = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema),  ctrl.register);

router.post('/login', validateBody(schemas.loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);
 
router.post('/logout', authenticate, ctrl.logout);
router.patch('/subscription',authenticate,validateBody(schemas.updateSubSchema), ctrl.updateSub )
router.patch('/avatars', authenticate , upload.single("avatar"), ctrl.updateAvatar)

module.exports = router;

