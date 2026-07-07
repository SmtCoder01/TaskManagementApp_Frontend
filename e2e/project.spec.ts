import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth';
import { WorkspaceHelper } from './helpers/workspace';
import { ProjectHelper } from './helpers/project';

test.describe('Project Smoke Test', () => {
  test('should create a project within a workspace', async ({ page }) => {
    const auth = new AuthHelper(page);
    const workspaceHelper = new WorkspaceHelper(page);
    const projectHelper = new ProjectHelper(page);

    // Register & Login a fresh user
    const email = `project-owner-${Date.now()}@example.com`;
    const password = 'Password123*';
    await auth.register('Project', 'Owner', email, password);
    await auth.login(email, password);

    // Create Workspace and navigate to it
    const workspaceName = `WS For Project - ${Date.now()}`;
    await workspaceHelper.createWorkspace(workspaceName);
    
    // Locate the workspace card and click Open Workspace
    const workspaceCard = page.locator('div.rounded-xl', { has: page.locator(`h3:has-text("${workspaceName}")`) }).first();
    await workspaceCard.locator('a:has-text("Open Workspace")').click();

    // Create Project
    const projectName = `Project - ${Date.now()}`;
    const projectDesc = 'E2E Test Project Description';
    await projectHelper.createProject(projectName, projectDesc);

    // Verify it appears in the list
    const projectCard = page.locator(`h3:has-text("${projectName}")`);
    await expect(projectCard).toBeVisible();
  });
});
