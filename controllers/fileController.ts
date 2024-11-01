import { prismaClientInstance } from "../utils";
import asyncHandler from "express-async-handler";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const file_get = asyncHandler(async (req, res, done) => {
    const file = await prismaClientInstance.file.findUnique({
        where: {
            id: Number(req.params.fileId)
        }
    });
    if(!file) res.status(401).json({success: false, file: file})
    else res.status(200).json({success: true, file: file})
});

export const file_create = 
    asyncHandler(async (req, res, done) => {
        console.log(req.body);
        res.status(200).json({success: true})
    });


export const file_update = asyncHandler(async (req, res, done) => {
    const updatedFile = await prismaClientInstance.file.update({
        where: {
            id: Number(req.params.fileId)
        },
        data: {
            name: req.body.name
        }
    });
    res.status(200).json({success: true, updatedFile: updatedFile})
});

export const file_delete = asyncHandler(async (req, res, done) => {
    await prismaClientInstance.file.delete({
        where: {
            id: Number(req.params.fileId)
        }
    });
    res.status(200).json({success: true})
})