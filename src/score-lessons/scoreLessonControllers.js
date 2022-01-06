import express from "express"
import { findClassById } from "../classes/classServices.js";
import { findLessonById } from "../lessons/lessonServices.js";
import { isLogging } from "../managers/managerServices.js"
import { findScoreByInfo, updateScore } from "../scores/scoreServices.js";
import { findTalentById } from "../talents/talentServices.js";
import { findScoresByClassLesson } from "./scoreLessonServices.js";
import { updateScoreLessonValidator } from "./scoreLessonValidators.js"
let scoreLessonRouter = new express.Router();

scoreLessonRouter.get("/", async (req, res, next) => {
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
        var checkExistLesson = await findLessonById(req.query.lessonId);
        if (!checkExistLesson) {
            return res.send({
                message: "Lesson not found",
                statusCode: 404
            })
        }
          var listResult = await findScoresByClassLesson(req.query);
          var listResultWithFullInfo = await Promise.all(listResult.map(async (item) => {
              return {...item, ...checkExistLesson}
        }))
          return res.send({
              message: "Get list score lessons successfully.",
              scoresInLesson: listResultWithFullInfo,
              statusCode: 200
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  scoreLessonRouter.patch("/", async (req, res, next) => {
    try {
      let validator = await updateScoreLessonValidator(req);
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
      var listResult = await Promise.all(req.body.talentScores.map(async (item) => {
        await updateScore({
          score: item.score,
          talentId: item.talent_id,
          classId: req.body.classId,
          lessonId: req.body.lessonId
        })
        var currentItem = await findScoreByInfo({
          talentId: item.talent_id,
          classId: req.body.classId,
          lessonId: req.body.lessonId
        })
        var currentTalent = await findTalentById(currentItem.talent_id);
        var currentLesson = await findLessonById(currentItem.lesson_id);
        var resultItem = {
          ...currentItem,
          ...currentTalent,
          ...currentLesson
        }
        return resultItem
      }))
        return res.send({
          updatedScores: listResult,
            message: "Update success.",
            statusCode: 200
            });
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  export {
    scoreLessonRouter
}