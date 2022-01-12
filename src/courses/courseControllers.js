import express from "express"
import { findManagerById, isLogging } from "../managers/managerServices.js"
import {createCourse, getListCourses, findCourseById, deleteCourseById, updateCourse, findCourseByInfo, findLessonNumberByCourseId, findClassNumberByCourseId, getListCoursesWithOtherInfo} from "./courseServices.js"
import {createCourseValidator, updateCourseValidator} from "./courseValidators.js"
let courseRouter = new express.Router();

courseRouter.post("/", async (req, res, next) => {
  try {
    let validator = await createCourseValidator(req);
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
    var checkExistCourse = await findCourseByInfo(req.body);
    if (checkExistCourse) {
        return res.send({
            message: "Course has already existed",
            statusCode: 409
        })
    }
    req.body.creatorId = req.session.user[0].manager_id
    let courseCreated = await createCourse(req.body);
    if (courseCreated) {
      var finalResult = await findCourseById(courseCreated);
      var manager = await findManagerById(finalResult.creator_id)
      var lessonNumber = await findLessonNumberByCourseId(finalResult.course_id)
      var classNumber = await findClassNumberByCourseId(finalResult.course_id)
        return res.send({
        message: "Create course successfully.",
        newCourse: {
          ...finalResult,
          lesson_number: lessonNumber[0].lesson_number,
          class_number: classNumber[0].class_number,
          creator_name: manager.full_name,
        },
        statusCode: 200
        });
    } else {
        return res.send({
        message: "Create course failed.",
        statusCode: 422
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

courseRouter.put("/", async (req, res, next) => {
    try {
      let validator = await updateCourseValidator(req);
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
      var currentCourse = await findCourseById(req.body.courseId);
      if (!currentCourse) {
          return res.send({
              message: "Course not found",
              statusCode: 404
          })
      }
      let updatedCourse = await updateCourse(req.body);
      if (updatedCourse) {
        var finalResult = await findCourseById(req.body.courseId);
        var manager = await findManagerById(finalResult.creator_id)
        var lessonNumber = await findLessonNumberByCourseId(finalResult.course_id)
        var classNumber = await findClassNumberByCourseId(finalResult.course_id)
          return res.send({
          message: "Update course successfully.",
          updatedCourse: {
            ...finalResult,
            lesson_number: lessonNumber[0].lesson_number,
            class_number: classNumber[0].class_number,
            creator_name: manager.full_name,
          },
          statusCode: 200
          });
      } else {
          return res.send({
          message: "Update course failed.",
          statusCode: 422
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

courseRouter.get("/", async (req, res, next) => {
    try {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
          var listResult = await getListCoursesWithOtherInfo();
          return res.send({
              message: "Get list courses successfully.",
              courses: listResult,
              statusCode: 200
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  courseRouter.delete("/:id", async (req, res, next) => {
    try {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
          var courseDeleted = await deleteCourseById(req.params.id);
          if (!courseDeleted) {
            res.send({
              message: "Course not found",
              statusCode: 404
            })
          } else {
            return res.send({
              message: "Delete course successfully.",
              courseDeleted,
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
    courseRouter
}