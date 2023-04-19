const httpError = (status = 404, message) => {
    const err = new Error(message);
    err.status = status;
    console.log("http error")
    throw err;
}
module.exports = httpError;