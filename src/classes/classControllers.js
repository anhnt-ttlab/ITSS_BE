import express from "express"
import { findManagerById, isLogging } from "../managers/managerServices.js"
import {createClass, getListClasses, findClassById, deleteClassById, updateClass, findClassByInfo, createClassLesson, findTalentumberByClassId} from "./classServices.js"
import { getListLessonsByCourseId } from "../lessons/lessonServices.js"
import {createClassValidator, updateClassValidator} from "./classValidators.js"
import { findCourseById } from "../courses/courseServices.js"
let classRouter = new express.Router();

classRouter.post("/", async (req, res, next) => {
  try {
    let validator = await createClassValidator(req);
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
    var checkExistClass = await findClassByInfo(req.body);
    if (checkExistClass) {
        return res.send({
            message: "Class has already existed",
            statusCode: 409
        })
    }
    req.body.creatorId = req.session.user[0].manager_id
    let classCreated = await createClass(req.body);
    if (classCreated) {
        var listResult = await getListLessonsByCourseId(req.body.courseId);
        var lessonsId = await Promise.all(listResult.map(async (item) => {
          return item.lesson_id
      }))
      await Promise.all(lessonsId.map(async (item) => {
        await createClassLesson({
          time:req.body.startDate, 
          classId:classCreated,
          lessonId:item
        })
        return 0
      }))
      var currentCourse = await findCourseById(req.body.courseId)
      var finalResult = await findClassById(classCreated);
      var manager = await findManagerById(finalResult.creator_id)
      var talentNumber = await findTalentumberByClassId(finalResult.class_id)
        return res.send({
        message: "Create class successfully.",
        newClass: {
          ...finalResult,
          course_name: currentCourse.course_name,
          creator_name: manager.full_name,
          talent_number: talentNumber[0].talent_number
        },
        statusCode: 200
        });
    } else {
        return res.send({
        message: "Create class failed.",
        statusCode: 422
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

classRouter.patch("/", async (req, res, next) => {
  try {
    let validator = await updateClassValidator(req);
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
    var checkExistClass = await findClassById(req.body.classId);
    if (!checkExistClass) {
        return res.send({
            message: "Class does not existed",
            statusCode: 409
        })
    }
    var checkExistInfo = await findClassByInfo(req.body);
    if (checkExistInfo) {
        return res.send({
            message: "Class has already existed",
            statusCode: 409
        })
    }
    req.body.creatorId = req.session.user[0].manager_id
    let classCreated = await updateClass(req.body);
    if (classCreated) {
        var listResult = await getListLessonsByCourseId(req.body.courseId);
        var lessonsId = await Promise.all(listResult.map(async (item) => {
          return item.lesson_id
      }))
      await Promise.all(lessonsId.map(async (item) => {
        await createClassLesson({
          time:req.body.startDate, 
          classId:classCreated,
          lessonId:item
        })
        return 0
      }))
      var currentCourse = await findCourseById(req.body.courseId)
      var finalResult = await findClassById(req.body.classId);
      var manager = await findManagerById(finalResult.creator_id)
      var talentNumber = await findTalentumberByClassId(finalResult.class_id)
        return res.send({
        message: "Update class successfully.",
        newClass: {
          ...finalResult,
          course_name: currentCourse.course_name,
          creator_name: manager.full_name,
          talent_number: talentNumber[0].talent_number
        },
        statusCode: 200
        });
    } else {
        return res.send({
        message: "Update class failed.",
        statusCode: 422
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

classRouter.get("/", async (req, res, next) => {
    try {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
          var listResult = await getListClasses();
          var listResultWithFullInfo = await Promise.all(listResult.map(async (item) => {
            var currentCourse = await findCourseById(item.course_id)
            var manager = await findManagerById(item.creator_id)
            var talentNumber = await findTalentumberByClassId(item.class_id)
            return {
              ...item,
              course_name: currentCourse.course_name,
              creator_name: manager.full_name,
              talent_number: talentNumber[0].talent_number
            }
        }))
          return res.send({
              message: "Get list classes successfully.",
              classes: listResultWithFullInfo,
              statusCode: 200
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

  classRouter.delete("/:id", async (req, res, next) => {
    try {
      let isLogged = await isLogging(req);
      if (isLogged === false) {
        return res.send({
          message: "You haven't logged in.",
          statusCode: 401
        });
      } else {
          var classDeleted = await deleteClassById(req.params.id);
          if (!classDeleted) {
            res.send({
              message: "Class not found",
              statusCode: 404
            })
          } else {
            return res.send({
              message: "Delete class successfully.",
              classDeleted,
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
    classRouter
}