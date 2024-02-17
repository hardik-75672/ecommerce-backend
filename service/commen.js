const passport = require("passport");

exports.auth=(req,res,done)=>{
    return passport.authenticate('jwt');
}

exports.sanitize=(user)=>{
    return {id:user.id,role:user.role};

}

exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    //TODO : this is temporary token for testing without cookie
   
    return token;
}