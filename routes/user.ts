import express from "express";
import passport from "passport";
import bcrypt from 'bcryptjs';
import { isAuth } from "../utils";
import { prismaClientInstance, validationAndSanitationMiddlewareFns_logIn, validationAndSanitationMiddlewareFns_signUp } from "../utils";
import { validationResult} from 'express-validator';

const router = express.Router();


router.post('/log-in', ...validationAndSanitationMiddlewareFns_logIn, (req, res, done) => {
  passport.authenticate('local', { failureMessage: true }, (err: any, user: Express.User, info: any) => {
    const message = info?.message;
    if (err) { return done(err); }
    if (!user) {
      return res.status(401).json({ success: false, sanitizedInputs: req.body, message: message});
    }

    // Explicitly log in the user and establish a session
    req.logIn(user, (err) => {
      if (err) { return done(err); }
      req.session.save((err) => { //save into session store
        if (err) { return done(err); }
        return res.json({ success: true });
      });
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

router.post('/logout', async (req, res, done) => {
  req.logout(function(err) {
    if (err) { return done(err); }
    res.status(200).json({success: true})
  });
});


router.get('/auth/status', (req, res, done) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ loggedIn: true});
  } else {
    res.status(401).json({ loggedIn: false});
  }
});

/* GET home page. - must be protected and return only logged in user data*/ 
router.get('/', isAuth, async (req, res, done)=> {
  const [folders, folderLessFiles] = await Promise.all([
    prismaClientInstance.folder.findMany({
      where: {
        user_id: Number(req.user),
        folder_id: null
      }
    }),
    prismaClientInstance.file.findMany({
      where: {
        user_id: Number(req.user),
        folder_id: null
      }
    })
  ]);
  const theFilesWithSizeInString =  folderLessFiles.map(file => {return {...file, size: file.size.toString()}})
  res.status(200).json({success: true, data: {folders: folders, folderLessFiles: theFilesWithSizeInString}})
});

export default router;