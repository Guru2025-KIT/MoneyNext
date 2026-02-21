/*
  Warnings:

  - You are about to drop the column `parentId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ai_insights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `budgets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emergency_funds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `family_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `goals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `government_scheme_eligibility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `government_schemes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `insurances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `investments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,deviceId]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "ai_insights" DROP CONSTRAINT "ai_insights_userId_fkey";

-- DropForeignKey
ALTER TABLE "bills" DROP CONSTRAINT "bills_userId_fkey";

-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_userId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "emergency_funds" DROP CONSTRAINT "emergency_funds_userId_fkey";

-- DropForeignKey
ALTER TABLE "family_members" DROP CONSTRAINT "family_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_userId_fkey";

-- DropForeignKey
ALTER TABLE "government_scheme_eligibility" DROP CONSTRAINT "government_scheme_eligibility_schemeId_fkey";

-- DropForeignKey
ALTER TABLE "government_scheme_eligibility" DROP CONSTRAINT "government_scheme_eligibility_userId_fkey";

-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_userId_fkey";

-- DropForeignKey
ALTER TABLE "investments" DROP CONSTRAINT "investments_userId_fkey";

-- DropForeignKey
ALTER TABLE "loans" DROP CONSTRAINT "loans_userId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_transferFromAccountId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_transferToAccountId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- DropIndex
DROP INDEX "audit_logs_entity_idx";

-- DropIndex
DROP INDEX "login_attempts_ipAddress_idx";

-- DropIndex
DROP INDEX "sessions_deviceId_idx";

-- DropIndex
DROP INDEX "sessions_expiresAt_idx";

-- DropIndex
DROP INDEX "users_createdAt_idx";

-- DropIndex
DROP INDEX "users_phoneNumber_idx";

-- DropIndex
DROP INDEX "users_status_idx";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "parentId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
DROP COLUMN "currency",
DROP COLUMN "deletedAt",
DROP COLUMN "gender",
DROP COLUMN "language",
DROP COLUMN "phoneVerified",
DROP COLUMN "timezone",
DROP COLUMN "twoFactorEnabled",
DROP COLUMN "twoFactorSecret";

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "ai_insights";

-- DropTable
DROP TABLE "bills";

-- DropTable
DROP TABLE "budgets";

-- DropTable
DROP TABLE "documents";

-- DropTable
DROP TABLE "emergency_funds";

-- DropTable
DROP TABLE "family_members";

-- DropTable
DROP TABLE "goals";

-- DropTable
DROP TABLE "government_scheme_eligibility";

-- DropTable
DROP TABLE "government_schemes";

-- DropTable
DROP TABLE "insurances";

-- DropTable
DROP TABLE "investments";

-- DropTable
DROP TABLE "loans";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "transactions";

-- DropEnum
DROP TYPE "BillFrequency";

-- DropEnum
DROP TYPE "BudgetPeriod";

-- DropEnum
DROP TYPE "DocumentType";

-- DropEnum
DROP TYPE "GoalStatus";

-- DropEnum
DROP TYPE "NotificationStatus";

-- DropEnum
DROP TYPE "NotificationType";

-- CreateIndex
CREATE UNIQUE INDEX "sessions_userId_deviceId_key" ON "sessions"("userId", "deviceId");
