-- Tags shipped in #108 via `prisma db push`, so production (which only runs
-- `migrate deploy`) never got the column and creating a log failed there.
ALTER TABLE "Log" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
