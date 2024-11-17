import express from "express";
import { isAuth } from "../utils";
import * as user_controller from '../controllers/userController';

const router = express.Router();


router.post('/log-in',  user_controller.user_logIn);

router.post('/sign-up', user_controller.user_signUp);
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
router.get('/', isAuth, user_controller.user_home);

export default router;