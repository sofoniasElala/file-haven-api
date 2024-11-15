import { PrismaClient } from '@prisma/client';
import { body } from 'express-validator';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_PROJECT_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

const supabaseClientInstance = createClient(supabaseUrl, supabaseKey)
const prismaClientInstance = new PrismaClient();

const isAuth = (req: any, res: any, done: any) => {
    if (req.isAuthenticated()) {
    done();
    }
    else 
    res.status(403).json({success: false, message: 'you\'re not authorized to access this resource'})
}

const validationAndSanitationMiddlewareFns_signUp = [
    body('username').trim().isLength({ min: 3, max: 20 }).escape().custom(async (value)=> {
        const userExists = await prismaClientInstance.user.findUnique({
            where: {
                username: value
            }
        });
        if (userExists) {
            throw new Error('Username already in use');
          }
    }),
    body('password').trim().escape().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'), 
    body('passwordConfirmation').trim().escape().custom((value, { req }) => {
    return value === req.body.password;
    }).withMessage('Passwords must match'), 
  ]
  
  const validationAndSanitationMiddlewareFns_logIn = [
    body('username').trim().escape(),
    body('password').trim().escape()
  ]

  const validationAndSanitationMiddlewareFns_folderCreate = [
    body('name').trim().escape(),
    body('user_id').trim().escape()
  ]
  const validationAndSanitationMiddlewareFns_folderUpdate = [
    body('name').trim().escape()
  ]

  const getSortByDirection = (column: string) => {
    if(column === 'undefined') return undefined
    else if(column === 'desc') return 'desc';
    else return 'asc';
  }

export {supabaseClientInstance, prismaClientInstance, isAuth, validationAndSanitationMiddlewareFns_logIn, validationAndSanitationMiddlewareFns_signUp, validationAndSanitationMiddlewareFns_folderCreate, validationAndSanitationMiddlewareFns_folderUpdate, getSortByDirection}