/*
  Warnings:

  - You are about to drop the column `title` on the `issues` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "issues" RENAME COLUMN "title" TO "fileName";
