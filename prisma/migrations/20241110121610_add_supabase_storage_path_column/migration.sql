/*
  Warnings:

  - Added the required column `storage_path` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "storage_path" TEXT NOT NULL;
