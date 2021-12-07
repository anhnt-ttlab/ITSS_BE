// src/users/controllers.js

import express from "express"
import {findManagerById, isLogging} from "../managers/managerServices.js"
import {createTalent, getListTalents, findTalentById, updateTalent, deleteTalentById, findTalentsByEmail} from "./talentServices.js"
import {createTalentValidator, updateTalentValidator} from "./talentValidators.js"
let talentRouter = new express.Router();

talentRouter.post("/", async (req, res, next) => {
  try {
    let validator = await createTalentValidator(req);
    if (validator !== null) {
      return res.send({message: validator});
    } else {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
        req.body.manager_id = req.session.user[0].manager_id
        let talentCreated = await createTalent(req.body);
        if (talentCreated) {
          return res.send({
            message: "Create talent successfully.",
            newTalent: talentCreated,
            statusCode: 200
          });
        } else {
          return res.send({
            message: "Email has been used.",
            statusCode: 422
          });
        }
      }
    }    
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

talentRouter.patch("/", async (req, res, next) => {
  try {
    let validator = await updateTalentValidator(req);
    if (validator !== null) {
      return res.send({message: validator});
    } else {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
        if (req.body.email) {
          var checkExistEmail = await findTalentsByEmail(req.body)
          if (checkExistEmail.length && checkExistEmail[0].talent_id != req.body.talent_id) {
            return res.send({
              message: "Email has been used.",
              statusCode: 422
            });
          }
        }
        var currentTalent = await findTalentById(req.body.talent_id)
        if (!currentTalent) {
          res.send({message: "Talent not found"})
        } else {
          let talentUpdated = await updateTalent(req.body);
          if (talentUpdated) {
            var currentManager = await findManagerById(talentUpdated.manager_id)
            return res.send({
              message: "Update talent successfully.",
              editedTalent: {
                ...talentUpdated,
                manager_name:currentManager.full_name,
              },
              statusCode: 200
            });
          }
        }
      }
    }    
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

talentRouter.get("/", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === false) {
      return res.send({
        message: "You haven't logged in.",
        statusCode: 401
      });
    } else {
        var listResult = await getListTalents();
        return res.send({
            message: "Get list talents successfully.",
            talents: listResult,
            statusCode: 200
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

talentRouter.get("/:id", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === false) {
      return res.send({
        message: "You haven't logged in.",
        statusCode: 401
      });
    } else {
        var talentDetail = await findTalentById(req.params.id);
        if (!talentDetail) {
          res.send({
            message: "Talent not found",
            statusCode: 404
          })
        } else {
        var managerInfo = await findManagerById(talentDetail.manager_id);
        if (!managerInfo) {
          res.send({
            message: "Manager not found",
            statusCode: 404
          })
        } else {
          return res.send({
            status: 200,
            message: "Get talent detail successfully.",
            talent: {
              ...talentDetail,
              manager_name: managerInfo.full_name
            },
        });
        }
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

talentRouter.delete("/:id", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === false) {
      return res.send({
        message: "You haven't logged in.",
        statusCode: 401
      });
    } else {
        var talentDeleted = await deleteTalentById(req.params.id);
        if (!talentDeleted) {
          res.send({
            message: "Talent not found",
            statusCode: 404
          })
        } else {
          return res.send({
            message: "Delete talent successfully.",
            talentDeleted,
            statusCode: 200
        });
        }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

export {
  talentRouter
}