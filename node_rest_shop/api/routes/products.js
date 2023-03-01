const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, 'img' + new Date().toISOString() + file.originalname);
    }
})

const fileFilter = ( req, file, cb ) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    {
        cb(null, true);
    }
    else 
        cb(null, false);
}
 
const upload = multer({storage: storage, limits: { fileSize: (1024 * 1024) * 5 }, fileFilter: fileFilter});

const ProductControllers = require('../controllers/products');

router.get('/', ProductControllers.get_all);

router.get('/:productId', ProductControllers.get_one)

router.patch('/:productId', checkAuth, ProductControllers.update_one)

router.delete('/:productId', checkAuth, ProductControllers.delete_one)

router.post('/', checkAuth, upload.single('productImage'), ProductControllers.create_one)



module.exports = router;