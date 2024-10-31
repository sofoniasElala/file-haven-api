import express from "express";
import * as folder_controller from '../controllers/folderController'

const router = express.Router();

router.post('/', folder_controller.folder_create);
router.get('/:folderId', folder_controller.folder_get);
router.put('/:folderId', folder_controller.folder_update)
router.delete('/:folderId', folder_controller.folder_delete);

export default router;