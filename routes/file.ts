import express from "express";
import * as file_controller from '../controllers/fileController';
import multer from "multer";

const router = express.Router();
// Store uploaded files in memory
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

router.post('/',upload.single('file'), file_controller.file_create);
router.get('/:fileName/download', file_controller.file_download);
router.get('/:fileId', file_controller.file_get);
router.put('/:fileId', file_controller.file_update);
router.delete('/:fileId', file_controller.file_delete);

export default router;