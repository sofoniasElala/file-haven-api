import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';


export const user_login_response  = asyncHandler((req, res, done) => {
    const message = req.flash('error')[0]; 
    let statusCode;
    let response;
    if(req.session.messages){
      statusCode = 401;
      response = {success: false, message: message}
    } else {
      statusCode = 200;
      response = {success: true}
    }
    res.status(statusCode).json(response);
  })