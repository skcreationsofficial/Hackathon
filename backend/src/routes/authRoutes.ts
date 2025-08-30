import express from 'express';
const router = express.Router()

const { authData, login } = require('../controllers/authController');

router.post('/authData', authData);
router.post('/authDataLogin', login);


export default router;