import express from "express"
import userController from "../controllers/userController.js"

const userRoutes = express.Router()

userRoutes.post("/auth", userController.loginUser)


export default userRoutes