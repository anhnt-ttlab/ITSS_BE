let raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
      let err = errors.array();
      let firstError = err.map(error => error.msg)[0];
      return firstError
    }
    return null;
  }

  let createLessonValidator = async (req) => {
    req.check('lessonName', 'lesson name id is required.').not().isEmpty();
    req.check('courseId', 'course id is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

  let updateLessonValidator = async (req) => {
    req.check('lessonId', 'lesson id is required.').not().isEmpty();
    req.check('lessonName', 'lesson name is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

 export {
    createLessonValidator,
    updateLessonValidator
  };