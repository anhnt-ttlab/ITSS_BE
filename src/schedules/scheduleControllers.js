// src/users/controllers.js

import express from "express"
import { isLogging } from "../managers/managerServices.js"
import {getListSchedulesByTalentId} from "./scheduleServices.js"
import {createSchedule} from "./scheduleServices.js"
import {findTalentById, findCourseById} from "../talents/talentServices.js"
import {createScheduleValidator} from "./scheduleValidators.js"
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
    var currentTalent = await findTalentById(req.body.talentId);
    if (!currentTalent) {
        return res.send({
            message: "Talent not found",
            statusCode: 404
        })
    }
    var currentCourse = await findCourseById(req.body.course_id);
    if (!currentCourse) {
        return res.send({
            message: "Course not found",
            statusCode: 404
        })
    }
    let scheduleCreated = await createSchedule(req.body);
    let result = {
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

scheduleRouter.get("/", async (req, res, next) => {
  try {
    let isLogged = await isLogging(req);
    if (isLogged === false) {
      return res.send({
        message: "You haven't logged in.",
        statusCode: 401
      });
    } else {
        var listResult = await getListSchedulesByTalentId(req.query.talentId);
        var result = await Promise.all(listResult.map(async (item) => {
            var course = await findCourseById(item.course_id);
            return {
                ...course,
                mean_score: item.mean_score
            }
        }))
        return res.send({
            message: "Get list schedules successfully.",
            schedules: result,
            statusCode: 200
        });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({error: "Server Error"});
  }
});

// talentRouter.get("/:id", async (req, res, next) => {
//   try {
//     let isLogged = await isLogging(req);
//     if (isLogged === false) {
//       return res.send({
//         message: "You haven't logged in.",
//         statusCode: 401
//       });
//     } else {
//         var talentDetail = await findTalentById(req.params.id);
//         if (!talentDetail) {
//           res.send({
//             message: "Talent not found",
//             statusCode: 404
//           })
//         } else {
//         var managerInfo = await findManagerById(talentDetail.manager_id);
//         if (!managerInfo) {
//           res.send({
//             message: "Manager not found",
//             statusCode: 404
//           })
//         } else {
//           return res.send({
//             status: 200,
//             message: "Get talent detail successfully.",
//             talent: {
//               ...talentDetail,
//               manager_name: managerInfo.full_name
//             },
//         });
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send({error: "Server Error"});
//   }
// });

// talentRouter.delete("/:id", async (req, res, next) => {
//   try {
//     let isLogged = await isLogging(req);
//     if (isLogged === false) {
//       return res.send({
//         message: "You haven't logged in.",
//         statusCode: 401
//       });
//     } else {
//         var talentDeleted = await deleteTalentById(req.params.id);
//         if (!talentDeleted) {
//           res.send({
//             message: "Talent not found",
//             statusCode: 404
//           })
//         } else {
//           return res.send({
//             message: "Delete talent successfully.",
//             talentDeleted,
//             statusCode: 200
//         });
//         }
//     }
//   } catch (error) {
//     console.log(error)
//     return res.status(500).send({error: "Server Error"});
//   }
// });

export {
    scheduleRouter
}