import express from "express";
import { INTERNAL_LINKS } from "../constant";
import { userController } from "../controllers";
import { validationSchema } from "../joiSchema";
import { authentication } from "../middleware";

export default express
  .Router()
  .post(
    INTERNAL_LINKS.USER.SIGNUP,
    validationSchema.registerUserSchema,
    userController.RegisterUser
  )
  .post(INTERNAL_LINKS.USER.REGISTER, userController.randomPasswordRegistration)
  .post(
    INTERNAL_LINKS.USER.LOGIN,
    validationSchema.loginUserSchema,
    userController.LoginUser
  )
  .post(
    INTERNAL_LINKS.USER.CHANGE_PASSWORD,
    authentication,
    userController.ChangePassword
  )
  .get(
    INTERNAL_LINKS.USER.USER_DETAIL,
    authentication,
    userController.UserDetail
  )
  .get(INTERNAL_LINKS.USER.USERS, authentication, userController.Users);
