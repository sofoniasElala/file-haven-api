-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_user_id_fkey";

-- DropForeignKey
ALTER TABLE "folder" DROP CONSTRAINT "folder_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "folder" DROP CONSTRAINT "folder_user_id_fkey";

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
