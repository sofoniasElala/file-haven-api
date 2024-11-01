import express from "express";
import passport from "passport";
import bcrypt from 'bcryptjs';
import { prismaClientInstance, validationAndSanitationMiddlewareFns_logIn, validationAndSanitationMiddlewareFns_signUp } from "../utils";
import { validationResult} from 'express-validator';

const router = express.Router();


router.post('/log-in', ...validationAndSanitationMiddlewareFns_logIn, (req, res, done) => {
  passport.authenticate('local', { failureMessage: true }, (err: any, user: Express.User, info: any) => {
    const message = info?.message;
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) {
      return res.status(400).json({success: false, sanitizedInputs: req.body, errors: message})
    }
    if (err) { return done(err); }
    if (!user) {
      // Send custom failure response with the message from `failureMessage`
      return res.status(401).json({ success: false, message: message});
    }

    // Explicitly log in the user and establish a session
    req.logIn(user, (err) => {
      if (err) { return done(err); }
      return res.json({ success: true });
    });
  })(req, res, done);
});

router.post('/sign-up', ...validationAndSanitationMiddlewareFns_signUp, async (req, res, done) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(400).json({success: false, sanitizedInputs: req.body, errors: errors})
  } else {
    const userCreationStatus = await prismaClientInstance.user.create({
      data: {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10)
      }
    });
    res.status(200).json({success: true});
  }
});

router.post('/logout', function(req, res, done){
  req.logout(function(err) {
    if (err) { return done(err); }
    res.status(200).json({success: true})
  });
});

/* GET home page. */
router.get('/', function(req, res, done) {
  res.status(200).json({success: 'homepage'})
});

export default router;