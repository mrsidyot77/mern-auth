const asyncHandler = (funcRequestHandler) =>{
    return (req,res,next) =>{ 
        Promise.resolve(funcRequestHandler(req,res,next))
        .catch((error)=> next(error))
    }
}

export {asyncHandler}