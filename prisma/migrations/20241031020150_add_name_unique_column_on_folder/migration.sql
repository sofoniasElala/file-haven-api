/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "folder" ADD COLUMN     "name" VARCHAR(25) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "folder_name_key" ON "folder"("name");
