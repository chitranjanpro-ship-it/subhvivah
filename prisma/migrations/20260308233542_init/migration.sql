-- CreateEnum
CREATE TYPE "AdminVertical" AS ENUM ('VERIFICATION', 'SUPPORT', 'SALES', 'CONTENT', 'FINANCE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUB_ADMIN';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 50.0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vertical" "AdminVertical";

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "assignedToId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "vertical" "AdminVertical" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageSuggestion" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMetric" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "responseRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "avgReplyTime" INTEGER NOT NULL DEFAULT 0,
    "isSuccessful" BOOLEAN NOT NULL DEFAULT false,
    "mutualInterest" BOOLEAN NOT NULL DEFAULT false,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatModerationEvent" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "actionTaken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatModerationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMetric_chatId_key" ON "ConversationMetric"("chatId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMetric" ADD CONSTRAINT "ConversationMetric_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatModerationEvent" ADD CONSTRAINT "ChatModerationEvent_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatModerationEvent" ADD CONSTRAINT "ChatModerationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
