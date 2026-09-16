-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "intended_use" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "ram_gb" INTEGER NOT NULL,
    "storage_gb" INTEGER NOT NULL,
    "psu_watts" INTEGER NOT NULL,
    "estimated_consumption_watts" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "warnings" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "explanation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quotes_created_at_idx" ON "quotes"("created_at");
