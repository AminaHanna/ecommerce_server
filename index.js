import express from "express";
import cors from "cors";
import connectDb from "./config/dbConnection.js";
import adminRoute from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";
import productRouter from "./routes/productRoute.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "./model/userModel.js";


const app = express();
connectDb();
dotenv.config();
app.use(cors())
app.use(express.json());
app.use(express.static(process.env.FILE_UPLOADING_PATH));


app.use("/api/admin", adminRoute);
app.use("/api/products", productRouter);
app.use("/api/cart", adminRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRoute);

app.get("/api/profile",(req,res)=>{
    console.log("api");
    console.log(req.headers.authorization);
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY,async function(err, decoded) {
        console.log(decoded) // bar
        // req.userId = decoded.userId
        const user = await User.findById(decoded.userId) 

        console.log(user)

        if(!user){
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json({user:user });

      });


});


app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running on PORT ${process.env.PORT || 3000}`);
})