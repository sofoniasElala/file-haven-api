import { prismaClientInstance, supabaseClientInstance } from "../utils";
import { SupabaseStorageError } from "../types/supabase";
import asyncHandler from "express-async-handler";
import { decode } from "base64-arraybuffer";

//GET file
export const file_get = asyncHandler(async (req, res, done) => {
    const file = await prismaClientInstance.file.findUnique({
        where: {
            id: Number(req.params.fileId)
        }
    });

    if(!file) res.status(401).json({success: false, message: 'File does not exist'})
    else res.status(200).json({success: true, file: {...file, size: file.size.toString()}})
});


//POST create file
export const file_create = asyncHandler(async (req, res, done) => {
    const file = req.file;
    console.log('multer FILE: ', file);
    // decode file buffer to base64
    const fileBase64 = decode(file!.buffer.toString("base64"));
    // upload the file to supabase
    const { data, error }: {data: {id: string; path: string; fullPath: string;} | null, error:SupabaseStorageError | null} = await supabaseClientInstance.storage
      .from("file-haven-files")
      .upload(file!.originalname, fileBase64, {
        contentType: file!.mimetype,
      });
      console.log("supabase", data, error);
      if(error){
        const errorMessage = error.statusCode == '400' ? 'Avoid special characters in name' : 'The file already exists';
        res.status(400).json({success: false, message: errorMessage})
        return;
      }
      const publicUrl = supabaseClientInstance.storage
                .from("file-haven-files")
                .getPublicUrl(data!.path);
        console.log('publicUrlData', publicUrl)
    const fileCreation = await prismaClientInstance.file.create({
        data: {
            name: file?.originalname!,
            size: file?.size!,
            type: file?.mimetype!,
            storage_path: data?.fullPath!,
            storage_url: publicUrl.data.publicUrl,//req.body.storage_url,
            user_id: Number(req.user),
            folder_id: Number(req.body.folder_id)
        }
    });
        res.status(200).json({success: true, file:  {...fileCreation, size: fileCreation.size.toString()}})
    });


// POST update file
export const file_update = asyncHandler(async (req, res, done) => {
    const { data, error } = await supabaseClientInstance.storage
            .from("file-haven-files")
            .move(req.body.originalName, req.body.name);

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