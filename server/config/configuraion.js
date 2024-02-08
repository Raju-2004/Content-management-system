module.exports ={
    mongoDbUrL : "mongodb+srv://kusaraju:HGJgDfMjzywf43dN@cluster0.yjvca42.mongodb.net/ContentCraft",
    PORT : process.env.PORT || 4000,
    globalVariables :(req,res,next)=>{
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        next();
    }
}
