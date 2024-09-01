// this miidleware will  convert eror into a json format 


function errorHandler(error, req, res, next) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
}


export default errorHandler;