import express from "express"
import { isLogging } from "../managers/managerServices.js"
import {updateScore, findScoreByInfo} from "./scoreServices.js"
import {getListScoresByInfo} from "./scoreServices.js"
import {findTalentById, findCourseById} from "../talents/talentServices.js"
import {updateScoreValidator} from "./scoreValidators.js"
import {findLessonById} from "../lessons/lessonServices.js"
import {findClassById, findClassLessonByInfo} from "../classes/classServices.js"
let scoreRouter = new express.Router();

scoreRouter.patch("/", async (req, res, next) => {
  try {
    let validator = await updateScoreValidator(req);
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
    var checkExistScore = await findScoreByInfo(req.body);
    if (!checkExistScore) {
        return res.send({
            message: "Score not found",
            statusCode: 404
        })
    }
    var currentTalent = await findTalentById(req.body.talentId);
    if (!currentTalent) {
        return res.send({
            message: "Talent not found",
            statusCode: 404
        })
    }
    var currentCourse = await findCourseById(req.body.courseId);
    if (!currentCourse) {
        return res.send({
            message: "Course not found",
            statusCode: 404
        })
    }
    var currentLesson = await findLessonById(req.body.lessonId);
    if (!currentLesson) {
        return res.send({
            message: "Lesson not found",
            statusCode: 404
        })
    }
    let scoreUpdated = await updateScore(req.body);
    if (scoreUpdated) {
        var course = await findCourseById(scoreUpdated.course_id);
        var talent = await findTalentById(scoreUpdated.talent_id);
        var lesson = await findLessonById(scoreUpdated.lesson_id);
        var result = {
            ...course,
            ...talent,
            ...lesson,
            score: req.body.score
        }
        return res.send({
        message: "Update score successfully.",
        updatedScore: result,
        statusCode: 200
        });
    } else {
        return res.send({
        message: "Update score failed.",
        statusCode: 422
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

scoreRouter.get("/", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === false) {
      return res.send({
        message: "You haven't logged in.",
        statusCode: 401
      });
    } else {
        var currentTalent = await findTalentById(req.query.talentId);
        if (!currentTalent) {
            return res.send({
                message: "Talent not found",
                statusCode: 404
            })
        }
        var listResult = await getListScoresByInfo(req.query);
        var result = await Promise.all(listResult.map(async (item) => {
            var currentClass = await findClassLessonByInfo({classId: req.query.classId, lessonId: item.lesson_id});
            var talent = await findTalentById(item.talent_id);
            var lesson = await findLessonById(item.lesson_id);
            var resultItem = {
                ...currentClass,
                ...talent,
                ...lesson,
                time: currentClass.time,
                score: item.score
            }
            delete resultItem.avatar;
            return resultItem
        }))
        return res.send({
            message: "Get list scores successfully.",
            scores: result,
            statusCode: 200
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

export {
    scoreRouter
}