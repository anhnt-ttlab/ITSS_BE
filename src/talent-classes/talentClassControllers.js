import express from "express"
import { createTalentClass, findClassById } from "../classes/classServices.js";
import { isLogging } from "../managers/managerServices.js"
import { findTalentById, findTalentsByManagerId } from "../talents/talentServices.js";
import { findTalentClassByInfo, findTalentClassesByClassId } from "./talentClassServices.js";
import { createTalentClassValidator } from "./talentClassValidators.js";
let talentClassRouter = new express.Router();

talentClassRouter.get("/", async (req, res, next) => {
    try {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
        var checkExistClass = await findClassById(req.query.classId);
        if (!checkExistClass) {
            return res.send({
                message: "Class not found",
                statusCode: 404
            })
        }
          var listResult = await findTalentClassesByClassId(req.query.classId);
          var talentInClassList = await Promise.all(listResult.map(async (item) => {
            var currentTalent = await findTalentById(item.talent_id)
            return {
              ...item,
              ... currentTalent
            }
        }))
        var talentsOfOwnManagerList = await findTalentsByManagerId(req.session.user[0].manager_id)
          return res.send({
              message: "Get list talentClasses successfully.",
              talentInClass: talentInClassList,
              talents: talentsOfOwnManagerList,
              statusCode: 200
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  talentClassRouter.post("/", async (req, res, next) => {
    try {
      let validator = await createTalentClassValidator(req);
      if (validator !== null) {
        return res.send({message: validator});
      }
      let isLogged = await isLogging(req);
      if (isLogged === false) {
      return res.send({
          message: "You haven't logged in.",
          statusCode: 401
      });
      }
      var checkExistTalentClass = await findTalentClassByInfo(req.body);
      if (checkExistTalentClass) {
          return res.send({
              message: "Talent Class has already existed",
              statusCode: 409
          })
      }
      let talentClassCreated = await createTalentClass(req.body);
      if (talentClassCreated) {
        var currentTalent = await findTalentById(req.body.talentId)
          return res.send({
          message: "Create talent class successfully.",
          newClass: {
            class_id: req.body.classId,
            ...currentTalent
          },
          statusCode: 200
          });
      } else {
          return res.send({
          message: "Create talent class failed.",
          statusCode: 422
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  export {
    talentClassRouter
}