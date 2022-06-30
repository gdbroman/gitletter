/*
  Warnings:

  - You are about to drop the column `newletterId` on the `github_integrations` table. All the data in the column will be lost.
  - You are about to drop the column `newletterId` on the `issues` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[newsletterId]` on the table `github_integrations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `newsletterId` to the `issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "github_integrations" RENAME COLUMN "newletterId" TO "newsletterId";

-- AlterTable
ALTER TABLE "issues" RENAME COLUMN "newletterId" TO "newsletterId";
