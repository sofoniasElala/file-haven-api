import { getSortByDirection, prismaClientInstance } from "../utils";
import asyncHandler from 'express-async-handler';
import { validationAndSanitationMiddlewareFns_folderCreate, validationAndSanitationMiddlewareFns_folderUpdate } from "../utils";
import { validationResult } from "express-validator";

//GET folder and its files
export const folder_get = asyncHandler(async (req, res, done) => {
    const folder = await prismaClientInstance.folder.findUnique({
        where: {
            id: Number(req.params.folderId),
            user_id: Number(req.user)
        },
        select: {
            id: true,
            name: true,
            updatedAt: true,
            folder_id: true,
            user_id: true,
            folders: {
              orderBy: {
                updatedAt: getSortByDirection(String(req.query.sortByUpdatedAt)),
                name: getSortByDirection(String(req.query.sortByName))
              }
            },
            files: {
              orderBy: {
                updatedAt: getSortByDirection(String(req.query.sortByUpdatedAt)),
                name: getSortByDirection(String(req.query.sortByName))
              }
            }
          }
    });
    if(!folder) res.status(401).json({success: false, message: 'Folder does not exist'})
    else res.status(200).json({success: true, folder: {...folder, files: folder.files.map(file => {return {...file, size: file.size.toString()}})}}) //converted to string bc json can't handle bigInt
        
});

//POST create folder
export const folder_create = [
    ...validationAndSanitationMiddlewareFns_folderCreate, 
    asyncHandler(async (req, res, done) => {
        const errors = validationResult(req);
        let dataObject: any =  {
                name: req.body.name,
                user_id: Number(req.user),
                folder_id: req.params.folderId ? Number(req.params.folderId) : null
            }
        if(!errors.isEmpty()){
            res.status(400).json({success: false, sanitizedInputs: req.body, errors: errors})
        } else {

            if(req.params?.folderId){
                dataObject =  {...dataObject, folder_id: Number(req.params.folderId)}
            }
            const folderCreation = await prismaClientInstance.folder.create({data: dataObject});
            res.status(200).json({success: true, folder: folderCreation});
        }
})]

//DELETE folder
export const folder_delete = asyncHandler(async (req, res, done) => {
     await prismaClientInstance.folder.delete({
        where: {
            id: Number(req.params.folderId)
        }
    });
    res.status(200).json({success: true})
});


//PUT update folder
export const folder_update = [...validationAndSanitationMiddlewareFns_folderUpdate, asyncHandler(async (req, res, done) => {
    const updatedFolder = await prismaClientInstance.folder.update({
        where: {
            id: Number(req.params.folderId)
        },
         data: {
            name: req.body.name
         }
    }); 
    res.status(200).json({success: true, updatedFolder: updatedFolder})
})]