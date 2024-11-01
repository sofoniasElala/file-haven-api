-- AlterTable
ALTER TABLE "folder" ADD COLUMN     "folder_id" INTEGER;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
