import asyncHandler from 'express-async-handler';
import passport from "passport";
import { prismaClientInstance, supabaseClientInstance, validationAndSanitationMiddlewareFns_logIn, validationAndSanitationMiddlewareFns_signUp, getSortByDirection } from "../utils";
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

export const user_delete = asyncHandler(async (req, res, done) => {
  const paths = await getPathsOfSupabaseFiles(String(req.user));
  const {error} = await supabaseClientInstance.storage
  .from("file-haven-files")
  .remove(paths!);

  if(error) console.log(error);

  await prismaClientInstance.user.delete({
      where: {
          id: Number(req.user)
      }
  });
  req.logout(function(err) {
    if (err) { return done(err); }
    res.status(200).json({success: true})
  })
})

export const user_logIn =  [
  ...validationAndSanitationMiddlewareFns_logIn,
   asyncHandler(async (req, res, done) => {
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
})]

export const user_signUp = [
  ...validationAndSanitationMiddlewareFns_signUp,
  asyncHandler(async (req, res, done) => {
    const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(400).json({success: false, errors: errors.array()[0].msg})
  } else {
        await prismaClientInstance.user.create({
          data: {
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10)
          }
    });
    res.status(200).json({success: true});
  }})
]

export const user_home = asyncHandler(async (req, res, done) => {
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
          updatedAt: getSortByDirection(String(req.query.sortByUpdatedAt)),
          name: getSortByDirection(String(req.query.sortByName))
        }
      },
      files: {
        where: {
          folder_id: null
        },
        orderBy: {
          updatedAt: getSortByDirection(String(req.query.sortByUpdatedAt)),
          name: getSortByDirection(String(req.query.sortByName))
        }
      }
    }
  });
const allDataWithFilesSizeInString = {...foldersAndFolderLessFiles, files: foldersAndFolderLessFiles?.files.map(file => {return {...file, size: file.size.toString()}})} //foldersAndFolderLessFiles.map(file => {return {...file, size: file.size.toString()}})
res.status(200).json({success: true, data: allDataWithFilesSizeInString})
})

async function getPathsOfSupabaseFiles(folder: string){
  const folderName = folder; 
const { data: files, error } = await supabaseClientInstance.storage
  .from('file-haven-files')
  .list(folderName);

if (error) {
  console.error("Error listing files:", error);
  return;
}

if (!files || files.length === 0) {
  console.log("No files found in the folder to delete.");
  return;
}


const filePaths = files.map(file => `${folderName}/${file.name}`);
 return filePaths;
}