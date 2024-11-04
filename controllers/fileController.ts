import { prismaClientInstance } from "../utils";
import asyncHandler from "express-async-handler";

//GET file
export const file_get = asyncHandler(async (req, res, done) => {
    const file = await prismaClientInstance.file.findUnique({
        where: {
            id: Number(req.params.fileId)
        }
    });

    if(!file) res.status(401).json({success: false})
    else res.status(200).json({success: true, file: {...file, size: file.size.toString()}})
});


//POST create file
export const file_create = asyncHandler(async (req, res, done) => {
    const fileCreation = await prismaClientInstance.file.create({
        data: {
            name: req.body.name,
            size: req.body.size,
            type: req.body.type,
            storage_url: req.body.storage_url,
            user_id: Number(req.user),
            folder_id: req.body.folder_id
        }
    });
        res.status(200).json({success: true, file:  {...fileCreation, size: fileCreation.size.toString()}})
    });


// POST update file
export const file_update = asyncHandler(async (req, res, done) => {
    const updatedFile = await prismaClientInstance.file.update({
        where: {
            id: Number(req.params.fileId)
        },
        data: {
            name: req.body.name
        }
    });
    res.status(200).json({success: true, file:  {...updatedFile, size: updatedFile.size.toString()}})
});


//DELETE file
export const file_delete = asyncHandler(async (req, res, done) => {
    await prismaClientInstance.file.delete({
        where: {
            id: Number(req.params.fileId)
        }
    });
    res.status(200).json({success: true})
})