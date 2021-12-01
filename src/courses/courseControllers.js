import express from "express"
import { isLogging } from "../managers/managerServices.js"
import {createCourse, getListCourses, findCourseById, deleteCourseById, updateCourse} from "./courseServices.js"
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
    req.body.creatorId = req.session.user[0].manager_id
    let courseCreated = await createCourse(req.body);
    let result = {
        newCourse: courseCreated
    }
    if (courseCreated) {
        return res.send({
        message: "Create course successfully.",
        newCourse: result,
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

courseRouter.patch("/", async (req, res, next) => {
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
      var updatedCourseResult = await findCourseById(req.body.courseId);
      let result = {
          updatedCourse: updatedCourseResult
      }
      if (updatedCourse) {
          return res.send({
          message: "Update course successfully.",
          newCourse: result,
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
          var listResult = await getListCourses();
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