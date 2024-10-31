const express = require('express');
const { createUser, getAllUsers, updateUser, deleteUser, signIn, refreshToken} = require('../controllers/user.controller');
const { checkAdmin, verifyToken } = require('../config/isAuth');
const router = express.Router();

router.get('/',checkAdmin,getAllUsers);
router.put('/:id',verifyToken,updateUser);
router.delete('/:id',verifyToken,deleteUser);
router.post('/signup',createUser);
router.post('/signin',signIn);
router.post('/refresh-token',refreshToken)



module.exports = router;