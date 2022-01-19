let raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
      let err = errors.array();
      let firstError = err.map(error => error.msg)[0];
      return firstError
    }
    return null;
  }


  let updateScoreValidator = async (req) => {
    req.check('talentId', 'talent id is required.').not().isEmpty();
    req.check('lessonId', 'lesson id is required.').not().isEmpty();
    req.check('score', 'score is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

 export {
    updateScoreValidator
  };