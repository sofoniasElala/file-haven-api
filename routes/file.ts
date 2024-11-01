import express from "express";
import * as file_controller from '../controllers/fileController';
const router = express.Router();

router.post('/', file_controller.file_create);
router.get('/:fileId', file_controller.file_get);
router.put('/:fileId', file_controller.file_update);
router.delete('/:fileId', file_controller.file_delete);

export default router;