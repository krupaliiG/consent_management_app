import express from "express";
import { INTERNAL_LINKS } from "../constant";
import { userController } from "../controllers";
import { validationSchema } from "../joiSchema";

export default express
  .Router()
  .post(
    INTERNAL_LINKS.USER.SIGNUP,
    validationSchema.registerUserSchema,
    userController.RegisterUser
  )
  .post(
    INTERNAL_LINKS.USER.LOGIN,
    validationSchema.loginUserSchema,
    userController.LoginUser
  );
