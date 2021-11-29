let raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
      let err = errors.array();
      let firstError = err.map(error => error.msg)[0];
      return firstError
    }
    return null;
  }
  
  let createTalentValidator = async (req) => {
    req.check('name', 'name is required.').not().isEmpty();
    req.check('email', 'email is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }

  let updateTalentValidator = async (req) => {
    req.check('talent_id', 'talent id is required.').not().isEmpty();
    //check for errors
    return await raiseErr(req);
  }
  
 export {
    createTalentValidator,
    updateTalentValidator,
  };