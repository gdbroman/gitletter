-- RenameForeignKey
ALTER TABLE "github_integrations" RENAME CONSTRAINT "github_integrations_newletterId_fkey" TO "github_integrations_newsletterId_fkey";

-- RenameForeignKey
ALTER TABLE "issues" RENAME CONSTRAINT "issues_newletterId_fkey" TO "issues_newsletterId_fkey";

-- RenameIndex
ALTER INDEX "github_integrations_newletterId_key" RENAME TO "github_integrations_newsletterId_key";
