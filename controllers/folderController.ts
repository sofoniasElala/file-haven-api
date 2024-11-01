import { prismaClientInstance } from "../utils";
import asyncHandler from 'express-async-handler';
import { validationAndSanitationMiddlewareFns_folderCreate } from "../utils";
import { validationResult } from "express-validator";

//GET folder and its files
export const folder_get = asyncHandler(async (req, res, done) => {
    const folder = await prismaClientInstance.folder.findUnique({
        where: {
            id: Number(req.params.folderId)
        },
        include: {
            files: true,
            folders: true
        }
    });
    if(!folder) res.status(401).json({success: false, folder: folder})
    else res.status(200).json({success: true, folder: {...folder, files: folder.files.map(file => {return {...file, size: file.size.toString()}})}}) //converted to string bc json can't handle bigInt
        
});

//POST create folder
export const folder_create = [
    ...validationAndSanitationMiddlewareFns_folderCreate, 
    asyncHandler(async (req, res, done) => {
        const errors = validationResult(req);
        let dataObject: any =  {
                name: req.body.name,
                user_id: Number(req.user)
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
export const folder_update = asyncHandler(async (req, res, done) => {
    const updatedFolder = await prismaClientInstance.folder.update({
        where: {
            id: Number(req.params.folderId)
        },
         data: {
            name: req.body.name
         }
    }); 
    res.status(200).json({success: true, updatedFolder: updatedFolder})
})