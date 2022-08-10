const router = require('express').Router();
const { validate, authorize } = require('../middleware');
const { user } = require('../controllers');
const { userLoginSchema } = require('../validations/user');

router.post('/login', validate(userLoginSchema), user.registerORlogin);
router.get('/dashboard', authorize, user.getDashboard);
router.get('/users', authorize, user.getUsers);
router.post('/addContact/:contactId', authorize, user.addContact);

module.exports = router;