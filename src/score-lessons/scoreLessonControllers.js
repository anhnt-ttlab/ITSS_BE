import express from "express"
import { findClassById } from "../classes/classServices.js";
import { findLessonById } from "../lessons/lessonServices.js";
import { isLogging } from "../managers/managerServices.js"
import { updateScore } from "../scores/scoreServices.js";
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

  scoreLessonRouter.put("/", async (req, res, next) => {
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
      await Promise.all(req.body.talentScores.map(async (item) => {
        console.log("req.body.talentScores", item);
        await updateScore({
          score: item.score | 0,
          talentId: item.talent_id,
          classId: req.body.classId,
          lessonId: req.body.lessonId
        })
      }))
        return res.send({
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