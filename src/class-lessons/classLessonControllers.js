import express from "express"
import { findClassById } from "../classes/classServices.js";
import { findLessonById } from "../lessons/lessonServices.js";
import { isLogging } from "../managers/managerServices.js"
import { findClassLessonByInfo, findClassLessonsByClassId, updateClassLesson } from "./classLessonServices.js"
import { updateClassLessonValidator } from "./classLessonValidators.js";
let classLessonRouter = new express.Router();

classLessonRouter.get("/", async (req, res, next) => {
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
          var listResult = await findClassLessonsByClassId(req.query.classId);
          var classInfo = await findClassById(req.query.classId)
          var listResultWithFullInfo = await Promise.all(listResult.map(async (item) => {
            var currentLesson = await findLessonById(item.lesson_id)
            return {
              ...item,
              ... currentLesson
            }
        }))
          return res.send({
              message: "Get list classLessons successfully.",
              classDetail: listResultWithFullInfo,
              class_name: classInfo.class_name,
              statusCode: 200
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  classLessonRouter.patch("/", async (req, res, next) => {
    try {
      let validator = await updateClassLessonValidator(req);
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
      var checkExistClassLesson = await findClassLessonByInfo(req.body);
      if (!checkExistClassLesson) {
          return res.send({
              message: "Class lesson does not existed",
              statusCode: 409
          })
      }
      let classLessonUpdated = await updateClassLesson(req.body);
      if (classLessonUpdated) {
        var currentLesson = await findLessonById(req.body.lessonId)
        var currentClassLesson = await findClassLessonByInfo(req.body);
        return res.send({
            updatedClassLesson: {
                ...currentLesson,
                ...currentClassLesson
            },
            message: "Update class lesson success.",
            statusCode: 200
            });
      } else {
          return res.send({
          message: "Update class lesson failed.",
          statusCode: 422
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  export {
    classLessonRouter
}