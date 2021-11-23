// src/users/controllers.js

import express from "express"
import {register, signIn, isLogging} from "./managerServices.js"
import {registerValidator, loginValidator} from "./managerValidators.js"
let managerRouter = new express.Router();

managerRouter.post("/register", async (req, res, next) => {
  try {
    let validator = await registerValidator(req);
    if (validator !== null) {
      return res.send({message: validator});
    } else {
      let registed = await register(req.body);
      if (registed) {
        return res.send({
          message: "Register successfully.",
          registed
        });
      } else {
        return res.send({message: "Email has been used."});
      }
    }    
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

managerRouter.get("/profile", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === false) {
      return res.send({message: "You haven't logged in."});
    } else {
      return res.send({
        message: "Get profile successfully.",
        profile: req.session.user  
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

managerRouter.post("/login", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === true) {
      return res.send({message: "You are logged in."});
    }
    let validator = await loginValidator(req);
    if (validator !== null) {
      return res.send({message: validator});
    }
    let signIned = await signIn(req)
    if (signIned === false) {
      return res.send({message: "Email or Password is incorrect"});
    } else {
      return res.send({
        message: "Sign In successfully.",
        signIned
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

managerRouter.get("/logout", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === false) {
      return res.send({
        message: "You are not logged in.",
        success: false,
        status: 401
      });
    }
    req.session.user = null;
    return res.send({
      message: "Sign Out successfully.",
      success: true,
      status: 200
    });
  } catch (error) {
    return res.status(500).send({error: "Server Error"});
  }
});

export {
  managerRouter
}