// src/users/controllers.js

let express = require("express");
let router = new express.Router();

let {register, signIn, isLogging} = require("./managerServices");
let {registerValidator, loginValidator} = require("./managerValidators");

router.post("/register", async (req, res, next) => {
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

router.get("/profile", async (req, res, next) => {
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

router.post("/login", async (req, res, next) => {
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


module.exports = router;