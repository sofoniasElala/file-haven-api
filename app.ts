import express from 'express';
import session from 'express-session';
import cors from 'cors';
import createError from 'http-errors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from './types/errors';
import bcrypt from 'bcryptjs';
import indexRouter from './routes/index';



const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();


const allowList = [`http://localhost:${PORT}`];
app.use(cors((req, callback) => {
    let corsOptions;
    if (allowList.indexOf(req.header('Origin') || "") !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
      } else {
        corsOptions = { origin: false } // disable CORS for this request
      }
      callback(null, corsOptions)
}));

app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(session({
  cookie: {
   maxAge: 7 * 24 * 60 * 60 * 1000, // ms - 1 week
   //secure: true     // its disabled in dev bc it requires https connection and localhost doesn't have that
  },
  secret: process.env.ACCESS_TOKEN_SECRET || "",
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    prisma,
    {
      checkPeriod: 10 * 60 * 1000,  //ms - 10 mins
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}))
app.use(passport.session()) //deals with express-session i.e req.user req.session

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    }
  });
  if (!user) { return done(null, false, { message: "Incorrect username" }); }

  const match = await bcrypt.compare(password, user.password);
   if (!match) { return done(null, false, { message: "Incorrect password" }); }

  return done(null, user);

} catch(err) {
  done(err);
}
  
}))

//adds user id to session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

//gets user id from session
passport.deserializeUser((userId: any, done) => {
  done(null, userId);

});

//TODO: DELETE THIS AFTER TESTING
app.use ((req, res, next) => {
  console.log(req.session); console.log(req.user);
next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);

    res.json({
      status: 'error',
      message: err.message,
      stack: req.app.get('env') === 'development' ? err.stack : {}
    });
  });

app.listen(PORT, ()=> {
    console.log(`app listening on port ${PORT}!`);
});