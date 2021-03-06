let raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
      let err = errors.array();
      let firstError = err.map(error => error.msg)[0];
      return firstError
    }
    return null;
  }

  let createScheduleValidator = async (req) => {
    req.check('talentId', 'talent id is required.').not().isEmpty();
    req.check('courseId', 'course id is required.').not().isEmpty();
    req.check('classId', 'class id is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }
  
  let deleteScheduleValidator = async (req) => {
    req.check('talentId', 'talent id is required.').not().isEmpty();
    req.check('courseId', 'course id is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

 export {
    createScheduleValidator,
    deleteScheduleValidator
  };