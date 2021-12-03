import express from "express"
import { isLogging } from "../managers/managerServices.js"
import {createLesson, getListLessonsByCourseId, findLessonById, updateLesson, deleteLessonById} from "./lessonServices.js"
import {createLessonValidator, updateLessonValidator} from "./lessonValidators.js"
import { findSchedulesByCourseId } from "../schedules/scheduleServices.js"
import { createScore } from "../scores/scoreServices.js"
let lessonRouter = new express.Router();

lessonRouter.post("/", async (req, res, next) => {
  try {
    let validator = await createLessonValidator(req);
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
    let lessonCreated = await createLesson(req.body);
    if (lessonCreated) {
      let schedulesList = await findSchedulesByCourseId(req.body.courseId);
      var talentsId = await Promise.all(schedulesList.map(async (item) => {
        return item.talent_id
    }))
    await Promise.all(talentsId.map(async (item) => {
      await createScore({
        talentId:item, 
        courseId:req.body.courseId,
        lessonId:lessonCreated
      })
      return 0
    }))
      var finalResult = await findLessonById(lessonCreated);
        return res.send({
        message: "Create lesson successfully.",
        newLesson: finalResult,
        statusCode: 200
        });
    } else {
        return res.send({
        message: "Create lesson failed.",
        statusCode: 422
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

lessonRouter.patch("/", async (req, res, next) => {
    try {
      let validator = await updateLessonValidator(req);
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
      var currentLesson = await findLessonById(req.body.lessonId);
      if (!currentLesson) {
          return res.send({
              message: "Lesson not found",
              statusCode: 404
          })
      }
      let updatedLesson = await updateLesson(req.body);
      var updatedLessonResult = await findLessonById(req.body.lessonId);
      if (updatedLesson) {
          return res.send({
          message: "Update lesson successfully.",
          updatedLesson: updatedLessonResult,
          statusCode: 200
          });
      } else {
          return res.send({
          message: "Update lesson failed.",
          statusCode: 422
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

lessonRouter.get("/", async (req, res, next) => {
    try {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
        var listResult = await getListLessonsByCourseId(req.query.courseId);
        var result = await Promise.all(listResult.map(async (item) => {
            var lesson = await findLessonById(item.lesson_id);
            return {
                ...lesson
            }
        }))
          // var listResult = await getListLessons();
          return res.send({
              message: "Get list lessons successfully.",
              lessons: result,
              statusCode: 200
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  lessonRouter.delete("/:id", async (req, res, next) => {
    try {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
          var lessonDeleted = await deleteLessonById(req.params.id);
          if (!lessonDeleted) {
            res.send({
              message: "Lesson not found",
              statusCode: 404
            })
          } else {
            return res.send({
              message: "Delete lesson successfully.",
              lessonDeleted,
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
    lessonRouter
}