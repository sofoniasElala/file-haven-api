import asyncHandler from 'express-async-handler';
import { prismaClientInstance, supabaseClientInstance } from '../utils';

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