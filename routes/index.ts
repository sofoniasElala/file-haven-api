import express from "express";
import passport from "passport";

const router = express.Router();

/* GET home page. */
router.get('/log-in',  passport.authenticate('local', { failureMessage: true}),  function(req, res, next) {
  let statusCode;
  let response;
  if(req.session.messages){
    statusCode = 401;
    response = {success: false, message: req.session.messages[0]}
  } else {
    statusCode = 200;
    response = {success: true}
  }
  res.status(statusCode).json(response);
});

router.get('/sign-up', function(req, res, next) {
  res.status(200).json({sucess: 'homepage'})
});

router.get('/', function(req, res, next) {
  res.status(200).json({sucess: 'homepage'})
});

export default router;