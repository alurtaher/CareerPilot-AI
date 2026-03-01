const express = require('express')
const router = express.Router();
const {
    registerUserController, 
    loginUserController, 
    logoutUserController, 
    getMeController 
    } = require('../controllers/auth.controller')
const { authUser } = require('../middlewares/auth.middleware')

/**
 * @route POST /api/auth/register
 * @description Register a new User
 * @access public
 */
router.post('/register', registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login a User with user and password
 * @access public
 */
router.post('/login', loginUserController)

/**
 * @route GET /api/auth/logout
 * @description Clear token from Cookie and add the user in blacklist
 * @access public
 */
router.get('/logout', logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description Clear the current login user-detail
 * @access private
 */
router.get('/get-me', authUser, getMeController)

module.exports = router