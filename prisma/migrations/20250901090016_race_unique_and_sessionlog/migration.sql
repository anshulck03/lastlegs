-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "date" DATETIME NOT NULL,
    "distance" TEXT NOT NULL,
    "status" TEXT,
    "url" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "distancePreference" TEXT NOT NULL,
    "fitnessLevel" TEXT NOT NULL,
    "strengthPriority" TEXT NOT NULL,
    "gender" TEXT,
    "sportsBackground" JSONB,
    "constraints" TEXT,
    "availability" JSONB,
    "facilities" JSONB,
    "coachTone" TEXT,
    "runPaceMinPerMi" REAL,
    "bikeMph" REAL,
    "swimSecPer100m" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SessionLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planHash" TEXT NOT NULL,
    "weekIndex" INTEGER NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "sport" TEXT NOT NULL,
    "plannedMin" INTEGER NOT NULL,
    "actualMin" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Race_name_date_key" ON "Race"("name", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionLog_userId_planHash_sessionKey_key" ON "SessionLog"("userId", "planHash", "sessionKey");
