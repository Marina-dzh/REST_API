const errorMessageList = {
    400:"Bad request",
    401:"Not authorized",
    403:"Forbidden",
    404:"Not Found",
    409:"Conflict",
    500:"Internal Server Error"
}

const httpError = (status, message=errorMessageList[status]) => {
    const err = new Error(message);
    err.status = status;
    console.log("http error")
    return err;
}
module.exports = httpError;