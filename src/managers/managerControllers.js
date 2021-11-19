// src/users/controllers.js

let express = require("express");
let router = new express.Router();

let {register} = require("./managerServices");
let {registerValidator} = require("./managerValidators");

router.post("/managers", async (req, res, next) => {
  try {
    let validator = await registerValidator(req);
    if (validator !== null) {
      return res.send({message: validator});
    } else {
      let registed = await register(req.body);
      if (registed == true) {
        return res.send({message: "Register successfully."});
      } else {
        return res.send({message: "Email has been used."});
      }
    }    
  } catch (error) {
    console.log("aeraer", error)
    return res.status(500).send({error: "Server Error"});
  }
});

module.exports = router;