import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth';
import { WorkspaceHelper } from './helpers/workspace';

test.describe('Workspace Smoke Test', () => {
  test('should create and navigate into a workspace', async ({ page }) => {
    const auth = new AuthHelper(page);
    const workspaceHelper = new WorkspaceHelper(page);

    // Register & Login a fresh user to keep test independent
    const email = `workspace-owner-${Date.now()}@example.com`;
    const password = 'Password123*';
    await auth.register('Workspace', 'Owner', email, password);
    await auth.login(email, password);

    // Create Workspace
    const workspaceName = `Workspace - ${Date.now()}`;
    const workspaceDesc = 'E2E Test Workspace Description';
    await workspaceHelper.createWorkspace(workspaceName, workspaceDesc);

    // Find the workspace card containing the title (using .first() to prevent nesting strict mode violations)
    const workspaceCard = page.locator('div.rounded-xl', { has: page.locator(`h3:has-text("${workspaceName}")`) }).first();
    await expect(workspaceCard).toBeVisible();

    // Navigate to it by clicking 'Open Workspace' inside the card
    await workspaceCard.locator('a:has-text("Open Workspace")').click();
    await expect(page).toHaveURL(/\/workspaces\/\d+/);
  });
});
