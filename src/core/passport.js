import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import { SECRET, AUTH } from '~/env';
import { MultiAccountUser } from '../authentication/document';
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
  },
  async (jwtPayload, done) => {
    try {
      if (Date.now() > jwtPayload.expires) return done('Token expired');

      const user = await MultiAccountUser.findOne({ username: jwtPayload.username }).exec();
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
));

passport.use(new GoogleStrategy({
    clientID: AUTH.GOOGLE.clientID,
    clientSecret: AUTH.GOOGLE.clientSecret,
    callbackURL: "https://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    MultiAccountUser.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

export default passport;
