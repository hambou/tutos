const express = require('express');
const router = express.Router();

const UserControllers = require('../controllers/users');

router.post('/signup', UserControllers.signup)

router.post('/login', UserControllers.login)

router.delete('/:usersId', UserControllers.delete_one)

module.exports = router;