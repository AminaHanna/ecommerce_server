import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../model/userModel.js";
import jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { Transaction } from "../model/Transaction.js";
import { Product } from "../model/Product.js";


export const register = (req, res) => {

    try {
        const { fname, lname, email, password } = req.body;

        if (!fname || !lname || !email || !password) {
            return res.status(400).json({ message: "All fields are mandatory" })
        }

        // .............encryption........ //

        //(saltRounds=10)
        //  req.body.password = myPlaintextPassword  //

        bcrypt.hash(req.body.password, 10, async (err, hash) => {
       

            const newUser = new User({
                fname, lname, email, password: hash
            })

            const saveUser = await newUser.save();

            if (saveUser) {
                return res.status(201).json({ user: saveUser, message: 'successfully inserted user into db' });
            }


        })

    }
    catch (error) {
        return res.status(404).json({ message: error.message || 'error' });
    }
}


export const login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are mandatory" })
    }

    const getUser = await User.findOne({ email })

    if (!getUser) {
        return res.status(400).json({ message: 'invalid email' })
    }


    bcrypt.compare(req.body.password, getUser.password).then(function (result) {

        if (result) {

            const token = jwt.sign({userId: getUser._id,isUser:getUser.isUser},process.env.JWT_SECRET_KEY, {expiresIn:"10h"})
            console.log("token: ",token);


            return res.status(200).json({ users: getUser, message: 'Successfull' ,token})
        } else {
            return res.status(400).json({ message: "Invalid Email or Password" })

        }
    });

}

export const getUser = async (req, res) => {

    try {
        const { id } = req.params;

        const getUser = await User.findById(id)

        if (!getUser) {
            return res.status(400).json({ message: "user is not found!" })
        }

        return res.status(200).json({ users: getUser, message: 'invalid email' })
    } catch (error) {
        return res.status(400).json({ message: error.message || 'error' })

    }

}

export const getUsers = async (req, res) => {

    try {

        const getUsers = await User.find()
        console.log(getUsers)

        if (getUsers.length === 0) {
            return res.status(400).json({ message: "user is not found!" })
        }else{

            return res.status(200).json({ users: getUsers })
        }

    } catch (error) {
        return res.status(400).json({ message: error.message || 'error' })

    }

}

export const getTransactions = async (req, res) => {

    try {

        console.log(req.headers.authorization);

        if(!req.headers.authorization){
            return res.status(404).json({message: 'error...' });  
        }

        jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY,async function(err, decoded) {
        console.log(decoded)

        if(err){
            return res.status(404).json({message: err.message || 'error...' });  
        }

        const getTransaction = await Transaction.aggregate([
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

            if(!getTransaction){
                return res.status(400).json({message:'not transations found'})
            }

            console.log(getTransaction)
            return res.status(200).json({data:getTransaction})

        })

    } catch (error) {
        return res.status(400).json({ message: error.message || 'error' })

    }

}