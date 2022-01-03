import express from "express"
import { isLogging } from "../managers/managerServices.js"
import {findTalentById, findCourseById} from "../talents/talentServices.js"
import {findClassById} from "../classes/classServices.js"
import { getListSchedulesByTalentId } from "../schedules/scheduleServices.js"
import { calMeanScore } from "../scores/scoreServices.js"
let meanScoreRouter = new express.Router();
meanScoreRouter.get("/", async (req, res, next) => {
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
        var scheduleList = await getListSchedulesByTalentId(req.query.talentId);
        var courseResult = []
        var allTalentScores = []
        await Promise.all(scheduleList.map(async (item) => {
            var currentClass = await findClassById(item.class_id);
            var currentCourse = await findCourseById(currentClass.course_id);
            courseResult.push(currentCourse);
        }))

        await Promise.all(courseResult.map(async (item) => {
            var meanScore = await calMeanScore(item.course_id)
            allTalentScores.push({
                ...item,
                meanScore
            })
        }))
        return res.send({
            message: "Get list scores successfully.",
            courses: courseResult,
            talentScores: scheduleList,
            allTalentScores: allTalentScores,
            statusCode: 200
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

export {
    meanScoreRouter
}