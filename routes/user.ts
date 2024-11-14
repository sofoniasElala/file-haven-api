import express from "express";
import passport from "passport";
import bcrypt from 'bcryptjs';
import { isAuth } from "../utils";
import { prismaClientInstance, validationAndSanitationMiddlewareFns_logIn, validationAndSanitationMiddlewareFns_signUp } from "../utils";
import { validationResult} from 'express-validator';
import * as user_controller from '../controllers/userController';

const router = express.Router();


router.post('/log-in', ...validationAndSanitationMiddlewareFns_logIn, (req, res, done) => {
  passport.authenticate('local', { failureMessage: true }, (err: any, user: any, info: any) => {
    const errors = info?.message;
    if (err) { return done(err); }
    if (!user) {
      return res.status(401).json({ success: false, errors: errors});
    }

    // Explicitly log in the user and establish a session
    req.logIn(user, (err) => {
      if (err) { return done(err); }
      req.session.save((err) => { //save into session store
        if (err) { return done(err); }
        return res.json({ success: true, username: user.username });
      });
    });
  })(req, res, done);
});

router.post('/sign-up', ...validationAndSanitationMiddlewareFns_signUp, async (req, res, done) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(400).json({success: false, errors: errors})
  } else {
        await prismaClientInstance.user.create({
          data: {
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10)
          }
    });
    res.status(200).json({success: true});
  }
});
router.post('/user/delete', isAuth, user_controller.user_delete);

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
  const foldersAndFolderLessFiles = await prismaClientInstance.user.findUnique({
      where: {
        id: Number(req.user)
      },
      select: {
        id: true,
        username: true,
        folders: {
          where: {
            folder_id: null
          },
          orderBy: {
            updatedAt: 'desc'
          }
        },
        files: {
          where: {
            folder_id: null
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }
      }
    });
  const allDataWithFilesSizeInString = {...foldersAndFolderLessFiles, files: foldersAndFolderLessFiles?.files.map(file => {return {...file, size: file.size.toString()}})} //foldersAndFolderLessFiles.map(file => {return {...file, size: file.size.toString()}})
  res.status(200).json({success: true, data: allDataWithFilesSizeInString})
});

export default router;