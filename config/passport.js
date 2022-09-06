const JwtStrategy = require("passport-jwt").Strategy;

// 拿出jwt
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").userModel;

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};
// new JwtStrategy(options, verify)
// options is an object literal containing options to control how the token is extracted from the request or verified.
// verify is a function with the parameters verify(jwt_payload, done)
// jwt_payload is an object literal containing the decoded JWT payload.
// done is a passport error first callback accepting arguments done(error, user, info)
// fromAuthHeaderWithScheme(auth_scheme) creates a new extractor that looks for the JWT in the authorization header, expecting the scheme to match auth_scheme.
