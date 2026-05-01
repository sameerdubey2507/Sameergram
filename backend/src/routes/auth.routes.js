const express = require('express');
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router();

// user auth APIs
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)



// general profile API
router.post('/user/google-login', authController.googleLogin);

router.get('/me', authMiddleware.generalAuthMiddleware, (req, res) => {
    res.status(200).json({
        user: req.user,
        role: req.userRole
    })
})

// food partner auth APIs
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)



module.exports = router;