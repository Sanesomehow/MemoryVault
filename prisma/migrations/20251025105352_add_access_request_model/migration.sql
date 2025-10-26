-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" TEXT NOT NULL,
    "requesterWallet" TEXT NOT NULL,
    "ownerWallet" TEXT NOT NULL,
    "mintAddress" TEXT NOT NULL,
    "nftName" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccessRequest_ownerWallet_idx" ON "AccessRequest"("ownerWallet");

-- CreateIndex
CREATE INDEX "AccessRequest_requesterWallet_idx" ON "AccessRequest"("requesterWallet");

-- CreateIndex
CREATE INDEX "AccessRequest_mintAddress_idx" ON "AccessRequest"("mintAddress");

-- CreateIndex
CREATE UNIQUE INDEX "AccessRequest_requesterWallet_mintAddress_key" ON "AccessRequest"("requesterWallet", "mintAddress");
