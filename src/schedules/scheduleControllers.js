import express from "express"
import { isLogging } from "../managers/managerServices.js"
import {getListSchedulesByTalentId, findScheduleByInfo, findSchedulesByCourseId, getListSchedulesByTalentIdWithOtherInfo} from "./scheduleServices.js"
import {createSchedule, deleteSchedule} from "./scheduleServices.js"
import {findTalentById, findCourseById} from "../talents/talentServices.js"
import {createScheduleValidator, deleteScheduleValidator} from "./scheduleValidators.js"
import {getListLessonsByCourseId} from "../lessons/lessonServices.js"
import { query } from "../../server.js";
import {createScore} from "../scores/scoreServices.js"
import {findClassById, createTalentClass, deleteTalentClassByInfo} from "../classes/classServices.js"
let scheduleRouter = new express.Router();

scheduleRouter.post("/", async (req, res, next) => {
  try {
    let validator = await createScheduleValidator(req);
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
    var checkExistSchedule = await findScheduleByInfo(req.body);
    if (checkExistSchedule) {
        return res.send({
            message: "Schedule has already existed",
            statusCode: 409
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
    var currentClass = await findClassById(req.body.classId);
    if (!currentClass) {
        return res.send({
            message: "Class not found",
            statusCode: 404
        })
    }
    await createTalentClass(req.body)
    let scheduleCreated = await createSchedule(req.body);
    let scheduleInfo = await findScheduleByInfo(req.body);
    let lessonsList = await getListLessonsByCourseId(scheduleInfo.course_id)
    await Promise.all(lessonsList.map(async (item) => {
      await createScore({
        talentId:scheduleInfo.talent_id,
        lessonId:item.lesson_id,
        classId: req.body.classId
      })
      return 0
    }))
    let result = {
        ...currentClass,
        ...currentCourse,
        mean_score: 0.0
    }
    if (scheduleCreated) {
        return res.send({
        message: "Create schedule successfully.",
        newSchedule: result,
        statusCode: 200
        });
    } else {
        return res.send({
        message: "Create schedule failed.",
        statusCode: 422
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

scheduleRouter.delete("/", async (req, res, next) => {
  try {
    // let validator = await deleteScheduleValidator(req);
    // if (validator !== null) {
    //   return res.send({message: validator});
    // }
    let isLogged = await isLogging(req);
    if (isLogged === false) {
    return res.send({
        message: "You haven't logged in.",
        statusCode: 401
    });
    }
    var checkExistSchedule = await findScheduleByInfo(req.query);
    if (!checkExistSchedule) {
        return res.send({
            message: "Schedule not found",
            statusCode: 404
        })
    }
    var currentTalent = await findTalentById(req.query.talentId);
    if (!currentTalent) {
        return res.send({
            message: "Talent not found",
            statusCode: 404
        })
    }
    var currentCourse = await findCourseById(req.query.courseId);
    if (!currentCourse) {
        return res.send({
            message: "Course not found",
            statusCode: 404
        })
    }
    let result = await deleteSchedule(req.query);
    if (result) {
       await deleteTalentClassByInfo(checkExistSchedule)
       let lessonsList = await getListLessonsByCourseId(req.query.courseId)
       await Promise.all(lessonsList.map(async (item) => {
        var deleteScoreSql = "DELETE FROM scores WHERE talent_id = ? and lesson_id = ?";
        var deleteScoreValues = [req.query.talentId, item.lesson_id];
        await query(deleteScoreSql, deleteScoreValues);
         return 0
       }))
        return res.send({
        message: "Delete schedule successfully.",
        statusCode: 200
        });
    } else {
        return res.send({
        message: "Delete schedule failed.",
        statusCode: 422
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

scheduleRouter.get("/", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === false) {
      return res.send({
        message: "You haven't logged in.",
        statusCode: 401
      });
    } else {
        var listResult = await getListSchedulesByTalentIdWithOtherInfo(req.query.talentId);
        return res.send({
            message: "Get list schedules successfully.",
            schedules: listResult,
            statusCode: 200
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

export {
    scheduleRouter
}