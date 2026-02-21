-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currency" TEXT DEFAULT 'USD',
ADD COLUMN     "language" TEXT DEFAULT 'en',
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timezone" TEXT DEFAULT 'UTC',
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
