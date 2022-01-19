let raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
      let err = errors.array();
      let firstError = err.map(error => error.msg)[0];
      return firstError
    }
    return null;
  }

  let createClassValidator = async (req) => {
    req.check('className', 'class name is required.').not().isEmpty();
    req.check('courseId', 'course id is required.').not().isEmpty();
    req.check('startDate', 'startDate id is required.').not().isEmpty();
    req.check('endDate', 'endDate id is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

  let updateClassValidator = async (req) => {
    req.check('classId', 'class id is required.').not().isEmpty();  
    req.check('className', 'class name is required.').not().isEmpty();
    req.check('courseId', 'course id is required.').not().isEmpty();
    req.check('startDate', 'startDate id is required.').not().isEmpty();
    req.check('endDate', 'endDate id is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

 export {
    createClassValidator,
    updateClassValidator
  };