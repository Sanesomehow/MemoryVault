-- CreateTable
CREATE TABLE "SharedAccess" (
    "id" TEXT NOT NULL,
    "ownerWallet" TEXT NOT NULL,
    "viewerWallet" TEXT NOT NULL,
    "mintAddress" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SharedAccess_viewerWallet_idx" ON "SharedAccess"("viewerWallet");

-- CreateIndex
CREATE INDEX "SharedAccess_ownerWallet_idx" ON "SharedAccess"("ownerWallet");
