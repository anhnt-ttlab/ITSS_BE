import express from "express"
import { bulkCreateTalentClass, findClassById } from "../classes/classServices.js";
import { isLogging } from "../managers/managerServices.js"
import { findTalentById, findTalentByIds, findTalentsByManagerId } from "../talents/talentServices.js";
import { findTalentClassesByClassId } from "./talentClassServices.js";
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
      let talentClassCreated = await bulkCreateTalentClass(req.body);
      if (talentClassCreated) {
        var currentTalent = await findTalentByIds(req.body.talentIds)
          return res.send({
          message: "Create talent class successfully.",
          talentInClass: currentTalent,
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