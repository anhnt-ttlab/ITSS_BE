import express from "express"
import { findClassById } from "../classes/classServices.js";
import { findLessonById } from "../lessons/lessonServices.js";
import { isLogging } from "../managers/managerServices.js"
import { findTalentById } from "../talents/talentServices.js";
import { findScoresByClassLesson } from "./scoreLessonServices.js";
let scoreLessonRouter = new express.Router();

scoreLessonRouter.get("/", async (req, res, next) => {
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
        var checkExistLesson = await findLessonById(req.query.lessonId);
        if (!checkExistLesson) {
            return res.send({
                message: "Lesson not found",
                statusCode: 404
            })
        }
          var listResult = await findScoresByClassLesson(req.query);
          var listResultWithFullInfo = await Promise.all(listResult.map(async (item) => {
              var currentTalent = await findTalentById(item.talent_id);
              return {...item, ...currentTalent, ...checkExistLesson}
        }))
          return res.send({
              message: "Get list score lessons successfully.",
              classDetail: listResultWithFullInfo,
              statusCode: 200
          });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({error: "Server Error"});
    }
  });

//   scoreLessonRouter.patch("/", async (req, res, next) => {
//     try {
//       let validator = await updateClassLessonValidator(req);
//       if (validator !== null) {
//         return res.send({message: validator});
//       }
//       let isLogged = await isLogging(req);
//       if (isLogged === false) {
//       return res.send({
//           message: "You haven't logged in.",
//           statusCode: 401
//       });
//       }
//       var checkExistClassLesson = await findClassLessonByInfo(req.body);
//       if (!checkExistClassLesson) {
//           return res.send({
//               message: "Class lesson does not existed",
//               statusCode: 409
//           })
//       }
//       let classLessonUpdated = await updateClassLesson(req.body);
//       if (classLessonUpdated) {
//         var currentLesson = await findLessonById(req.body.lessonId)
//         var currentClassLesson = await findClassLessonByInfo(req.body);
//         return res.send({
//             updatedClassLesson: {
//                 ...currentLesson,
//                 ...currentClassLesson
//             },
//             message: "Update class lesson success.",
//             statusCode: 200
//             });
//       } else {
//           return res.send({
//           message: "Update class lesson failed.",
//           statusCode: 422
//           });
//       }
//     } catch (error) {
//       console.log(error)
//       return res.status(500).send({error: "Server Error"});
//     }
//   });

  export {
    scoreLessonRouter
}