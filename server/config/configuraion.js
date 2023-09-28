module.exports ={
    mongoDbUrL : "mongodb://127.0.0.1/ContentCraft",
    PORT : process.env.PORT || 4000,
    globalVariables :(req,res,next)=>{
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        next();
    }
}