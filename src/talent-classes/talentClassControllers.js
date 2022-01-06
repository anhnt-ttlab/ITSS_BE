import express from "express"
import { bulkCreateTalentClass, findClassById } from "../classes/classServices.js";
import { getListLessonsByClassId } from "../lessons/lessonServices.js";
import { isLogging } from "../managers/managerServices.js"
import { createScore } from "../scores/scoreServices.js";
import { findTalentById, findTalentByIds, findTalentsByManagerId } from "../talents/talentServices.js";
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
        var talentsOfOwnManagerList = await findTalentsByManagerId(req.session.user[0].manager_id)
        var talentsResult = []
        await Promise.all(talentsOfOwnManagerList.map(async (item) => {
          var currentTalent = await findTalentClassByInfo({talentId: item.talent_id, classId: req.query.classId})
          if (!currentTalent) {
            talentsResult.push(item)
          }
          return 0
      }))
          return res.send({
              message: "Get list talentClasses successfully.",
              talentInClass: listResult,
              talents: talentsResult,
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
        var talentsOfOwnManagerList = await findTalentsByManagerId(req.session.user[0].manager_id)
        var talentsResult = []
        await Promise.all(talentsOfOwnManagerList.map(async (item) => {
          var currentTalent = await findTalentClassByInfo({talentId: item.talent_id, classId: req.body.classId})
          if (!currentTalent) {
            talentsResult.push(item)
          }
          return 0
      }))
      let lessonsList = await getListLessonsByClassId(req.body.classId)
      await Promise.all(req.body.talentIds.map(async (item) => {
        await Promise.all(lessonsList.map(async (item2) => {
          await createScore({
            talentId:item,
            lessonId:item2.lesson_id,
            classId: req.body.classId
          })
          return 0
        }))
        return 0
      }))
          return res.send({
          message: "Create talent class successfully.",
          talentInClass: currentTalent,
          talents: talentsResult,
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