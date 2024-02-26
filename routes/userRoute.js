import express, { Router } from "express";
import { register, login,getUsers,getUser, getTransactions } from "../controller/userController.js";
import { addToCart, listCart } from "../controller/orderController.js";


const router = Router()

router.post('/register', register);
router.post('/login', login);
// router.get('/:id', getUser);
router.get('/', getUsers);
router.get('/transactions', getTransactions);
router.post('/addtocart',addToCart)
router.get('/listCart',listCart)


export default router;

