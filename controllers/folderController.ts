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
        }
    });
    console.log(folder)
});

//POST create folder
export const folder_create = [
    ...validationAndSanitationMiddlewareFns_folderCreate, 
    asyncHandler(async (req, res, done) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({success: false, sanitizedInputs: req.body, errors: errors})
        } else {
            const folderCreation = await prismaClientInstance.folder.create({
                data: {
                    name: req.body.name,
                    user_id: Number(req.user)
                }
            });
            console.log(folderCreation);
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