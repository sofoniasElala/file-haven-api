import { prismaClientInstance, supabaseClientInstance } from "../utils";
import { SupabaseStorageError } from "../types/supabase";
import asyncHandler from "express-async-handler";
import { decode, encode } from "base64-arraybuffer";

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
      .upload(req.user + '/' + file!.originalname, fileBase64, {
        contentType: file!.mimetype,
      });
      console.log("supabase", data, error);
      if(error){
        let errorMessage;
        if(error.statusCode == '400' ){
         errorMessage =  'Avoid special characters in name';
        } else if(error.statusCode == '413'){
            errorMessage = 'File exceeds maximum allowed size'
        } else {
            errorMessage = 'The file already exists';
        }
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
    await supabaseClientInstance.storage
            .from("file-haven-files")
            .move(req.user + '/' + req.body.originalName, req.user + '/' + req.body.name);

    const updatedFile = await prismaClientInstance.file.update({
        where: {
            id: Number(req.params.fileId)
        },
        data: {
            name: req.body.name,
            storage_path: 'file-haven-files/' + req.user + '/' + req.body.name,
            storage_url: process.env.SUPABASE_PROJECT_URL + '/storage/v1/object/public/file-haven-files/' + req.user + '/' +  req.body.name
        }
    });
    res.status(200).json({success: true, file:  {...updatedFile, size: updatedFile.size.toString()}})
});


//DELETE file
export const file_delete = asyncHandler(async (req, res, done) => {
    const  {error} = await supabaseClientInstance.storage
    .from("file-haven-files")
    .remove([req.user + '/' + req.body.name]);

    await prismaClientInstance.file.delete({
        where: {
            id: Number(req.params.fileId)
        }
    });
    res.status(200).json({success: true})
})

//GET blob for download
export const file_download = asyncHandler(async (req, res, done) => {
    const { data, error } = await supabaseClientInstance.storage
                .from("file-haven-files")
                .download(req.user + '/' + req.params.fileName);
    const blobArrayBuffer = await data?.arrayBuffer();
    if(!error) res.status(200).json({success: true, base64File: encode(blobArrayBuffer!), type: data.type});
    else res.status(400).json({success: false, message: "Unable to download file"});

})