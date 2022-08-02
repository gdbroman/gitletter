/*
  Warnings:

  - You are about to drop the column `authorId` on the `issues` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_authorId_fkey";

-- AlterTable
ALTER TABLE "issues" DROP COLUMN "authorId";
