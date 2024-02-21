import mongoose from "mongoose";
import { Product } from "../model/Product.js";
import jwt from "jsonwebtoken"


import { Order } from "../model/Orders.js";
import { Transaction } from "../model/Transaction.js";
import { Cart } from "../model/Cart.js";


export const createOrder =async (req, res) => {


    // console.log(req.body)


    // return true

    try {
        const { fname, lname, userId, productId } = req.body

        
        if(!fname) {
            return res.status(400).json({ message: "fname is missing" })
        }
        if (!lname) {
            return res.status(400).json({ message: "lname is missing" })
        }
        if (!productId) {
            return res.status(400).json({ message: "productId is missing" })
        }
        if (!userId) {
            return res.status(400).json({ message: "userId is missing" })
        }

        const id = Math.random().toString(16).slice(2)
    

        const isProduct = await Product.findById(req.body.productId)

     
        if(!isProduct){
            return res.status(400).json({message:'product is not existing'})
        }

        const newTransaction = new Transaction({
            productId:req.body.productId,
            userId:req.body.userId,
            transactionId:id
        })

        const savedPayment = newTransaction.save()



        const newOrder = new Order({
            fname,
            lname,
            productId,
            userId
        })

        const orderSaved = await newOrder.save() 
        
        return res.status(201).json({data:orderSaved,message: 'successfully ordered' });

    } catch (error) {
        return res.status(404).json({message: error.message || 'error' });      
    }
}

export const addToCart = async (req, res) => {
    console.log(req.body.productId)
    if(!req.body.productId){
        return res.status(404).json({message: 'error' })
    }
    console.log(req.headers.authorization);
    if(!req.headers.authorization){
        return res.status(400).json({message:"not token"})
    }
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY,async function(err, decoded) {
        console.log(decoded)
        const newCart = new Cart({
            productId:req.body.productId,
            userId:decoded.userId
        })
        const savedCart =await newCart.save();
        return res.status(200).json({ cart: savedCart });

         
    })



}

export const listCart = async (req, res) => {

    try {

      

        console.log(req.headers.authorization);
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY,async function(err, decoded) {
        console.log(decoded)

        const listCart = await Cart.aggregate([
            {
                $match:{userId:new mongoose.Types.ObjectId(decoded.userId) }
            },
            {
                $lookup:{
                    from:"products",
                    localField:"productId",
                    foreignField:"_id",
                    as:"product"
                }
            }


        ])

            if(!listCart){
                return res.status(400).json({message:'cart not found'})
            }

            console.log(listCart)
            return res.status(200).json({data:listCart})

        })

    } catch (error) {
        return res.status(400).json({ message: error.message || 'error' })

    }

}
