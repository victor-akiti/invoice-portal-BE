const returnError = (error, req, res, next) => {
    console.log({error12: error});
    res.status(error.errorCode).send({status: "Failed", error: {message: error.name}})
}

module.exports = returnError