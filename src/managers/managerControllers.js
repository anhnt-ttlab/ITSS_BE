// src/users/controllers.js

let express = require("express");
let router = new express.Router();

let {register, login} = require("./managerServices");
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

router.post("/login", async (req, res, next) => {
  try {
    let result = await login(req.body);
    if (result) {
      return res.send({token: "eyJraWQiOiI5ZGMyNytQalhQR0tNRVBJNUREelFheDY1SDN5OU1XWFFzXC9iYmFCYVwvdHc9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjOGJiMDc4My04NjIwLTQxYjUtYTRiMy1hNDk1NzUzOThhNGYiLCJhdWQiOiI1Z2Y0a3FtY2VsYTF1NzQ4cmt2aGpoZ3ZlNSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6ImY0Zjg1YjBjLTQxZWEtNGJjZi1hODMxLTI1NTc2MzhiZjViMiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjIzMjA4MDIxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9hcTdsNWgyalAiLCJjb2duaXRvOnVzZXJuYW1lIjoic29ubmRfazYxIiwiZXhwIjoxNjIzMjExNjIxLCJpYXQiOjE2MjMyMDgwMjEsImVtYWlsIjoic29ubmRfazYxQGlyZXAuY28uanAifQ.stFSjd0AXuoVpW2Kjiw1tfOtwu6n_xiofDBOWVWIKgz9m1IrYkwfJ9VLlU6llNdOT6ZOB9gkHCu_UXVS85N2VOuWc59knFVjEcHQ1V1zhzx_RSz8SXphS3c0GP9jP6reoqIJE_CIPMaTeRvEMlNkgKdMu-qMJjeeIBz0jAq4YXfehFfXqcI0eCQj1_W0XuvKwBaV580XvqWfw52Lwjn4C84cr_DRgGPmBpyovJsSqlgg9JkKEgMvKW2hMi1iwjEjiKZwwdlRUxqBo4EX_H1akBEk0V5Le0OffNaktK2mXVFOh1W_Qo0dx2zjAKe77Qx_RVBwYod0U3PmDhmwxBg_yQ"});
    } else {
      return res.send({message: "login fail"});
    }
  } catch (error) {
    console.log("aeraer", error)
    return res.status(500).send({error: "Server Error"});
  }
});

router.get("/login/me", async (req, res, next) => {
  try {
    return res.send({
      user_id: "12345678",
      username: 'tien anh',
      user_email: 'anh@gmail.com'
    })    
  } catch (error) {
    console.log("aeraer", error)
    return res.status(500).send({error: "Server Error"});
  }
});

router.get("/getInfor", async (req, res, next) => {
  try {
    return res.send({
      message: 'Helloworld'
    })    
  } catch (error) {
    console.log("aeraer", error)
    return res.status(500).send({error: "Server Error"});
  }
});

module.exports = router;