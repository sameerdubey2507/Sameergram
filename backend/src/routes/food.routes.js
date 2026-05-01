const express = require('express');
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();
const multer = require('multer');


const upload = multer({
    storage: multer.memoryStorage(),
})


/* POST /api/food/ [protected]*/
router.post('/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single("mama"),
    foodController.createFood)


/* GET /api/food/ [public] */
router.get("/",
    foodController.getFoodItems)


router.post('/like',
    authMiddleware.generalAuthMiddleware,
    foodController.likeFood)


router.post('/save',
    authMiddleware.generalAuthMiddleware,
    foodController.saveFood
)


router.get('/save',
    authMiddleware.generalAuthMiddleware,
    foodController.getSaveFood
)

router.post('/comment',
    authMiddleware.generalAuthMiddleware,
    foodController.commentFood
)


module.exports = router