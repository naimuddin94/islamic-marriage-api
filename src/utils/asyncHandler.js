const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
    
    

// old functional concept
    
// function asyncHandler(requestHandler) {
//     return function (req, res, next) { 
//         Promise.resolve(requestHandler(req, res, next)).catch(err =>next(err));
//     }
// }