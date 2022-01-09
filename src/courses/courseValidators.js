let raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
      let err = errors.array();
      let firstError = err.map(error => error.msg)[0];
      return firstError
    }
    return null;
  }

  let createCourseValidator = async (req) => {
    req.check('courseName', 'course name is required.').not().isEmpty();
    req.check('description', 'course description is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

  let updateCourseValidator = async (req) => {
    req.check('courseId', 'course id is required.').not().isEmpty();
    req.check('courseName', 'course name is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

 export {
    createCourseValidator,
    updateCourseValidator
  };