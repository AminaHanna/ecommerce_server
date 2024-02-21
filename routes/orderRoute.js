import express, { Router } from "express";
import { createOrder, getOrders } from "../controller/orderController.js";


const router = Router()

router.post('/', createOrder);
router.get('/', getOrders);

export default router;

