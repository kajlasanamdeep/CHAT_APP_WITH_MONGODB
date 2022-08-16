const router = require('express').Router();
const { validate, authorize } = require('../middleware');
const { user } = require('../controllers');
const { userLoginSchema } = require('../validations/user');

router.post('/login', validate(userLoginSchema), user.registerORlogin);
router.use(authorize);
router.get('/dashboard', user.getDashboard);
router.get('/users', user.getUsers);
router.get('/messages/:contactId', user.getMessages)
router.post('/addContact/:contactId', user.addContact);

module.exports = router;