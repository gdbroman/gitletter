/*
  Warnings:

  - You are about to drop the column `stripe_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_stripe_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_id",
ADD COLUMN     "stripe_customer_id" TEXT,
ADD COLUMN     "stripe_product_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");
