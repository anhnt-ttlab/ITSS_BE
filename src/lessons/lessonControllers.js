import express from "express"
import { isLogging } from "../managers/managerServices.js"
import {createLesson, getListLessons, findLessonById, updateLesson} from "./lessonServices.js"
import {createLessonValidator, updateLessonValidator} from "./lessonValidators.js"
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
    let result = {
        newLesson: lessonCreated
    }
    console.log("lessonCreated",lessonCreated)
    if (lessonCreated) {
        return res.send({
        message: "Create lesson successfully.",
        newLesson: result,
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
      let result = {
          updatedLesson: updatedLessonResult
      }
      if (updatedLesson) {
          return res.send({
          message: "Update lesson successfully.",
          newLesson: result,
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
          var listResult = await getListLessons();
          return res.send({
              message: "Get list lessons successfully.",
              lessons: listResult,
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