
function errorHandler ( req,res,next,error){
    if(error){
        if(error.name === "UnauthorizedError"){
            // jwt authentication error
            return res.status(401).json({messgae : "The user is not authorized"})
        }

        if(error.name === "ValidationError"){
            // Validation error
            return res.status(401).json({message : error})
        }

        // default to 500 server error
        return res.status(500).json(error);

    }
}

module.exports = errorHandler