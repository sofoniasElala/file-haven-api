-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_folder_id_fkey";

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "folder_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
