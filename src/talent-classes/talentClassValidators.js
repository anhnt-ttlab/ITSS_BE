let raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
      let err = errors.array();
      let firstError = err.map(error => error.msg)[0];
      return firstError
    }
    return null;
  }

  let createTalentClassValidator = async (req) => {
    req.check('classId', 'class id is required.').not().isEmpty();  
    req.check('talentIds', 'talent ids is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

 export {
    createTalentClassValidator
  };