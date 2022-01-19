import express from "express"
import { isLogging } from "../managers/managerServices.js"
import {findTalentById, findCourseById} from "../talents/talentServices.js"
import {findClassById} from "../classes/classServices.js"
import { getListSchedulesByTalentId, getListSchedulesByTalentIdWithMoreInfo } from "../schedules/scheduleServices.js"
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
        var scheduleList = await getListSchedulesByTalentIdWithMoreInfo(req.query.talentId);
        var courseResult = []
        // await Promise.all(scheduleList.map(async (item) => {
        //     courseResult.push(currentCourse);
        // }))
        await Promise.all(scheduleList.map(async (item) => {
          var meanScore = await calMeanScore(item.course_id)
            courseResult.push({
              course_id: item.course_id,
              course_name: item.course_name,
              talent_score: item.mean_score,
              mean_score: Math.round(meanScore * 100) / 100
            });
        }))
        return res.send({
            message: "Get list scores successfully.",
            scroreInfo: courseResult,
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