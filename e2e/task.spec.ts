import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth';
import { WorkspaceHelper } from './helpers/workspace';
import { ProjectHelper } from './helpers/project';
import { TaskHelper } from './helpers/task';

test.describe('Task CRUD Smoke Test', () => {
  test('should perform full task lifecycle', async ({ page }) => {
    const auth = new AuthHelper(page);
    const workspaceHelper = new WorkspaceHelper(page);
    const projectHelper = new ProjectHelper(page);
    const taskHelper = new TaskHelper(page);

    // Register & Login fresh user
    const email = `task-owner-${Date.now()}@example.com`;
    const password = 'Password123*';
    await auth.register('Task', 'Owner', email, password);
    await auth.login(email, password);

    // Create Workspace and navigate to it
    const workspaceName = `WS For Task - ${Date.now()}`;
    await workspaceHelper.createWorkspace(workspaceName);
    
    // Locate the workspace card and click Open Workspace
    const workspaceCard = page.locator('div.rounded-xl', { has: page.locator(`h3:has-text("${workspaceName}")`) }).first();
    await workspaceCard.locator('a:has-text("Open Workspace")').click();

    // Create Project and navigate to it
    const projectName = `Proj For Task - ${Date.now()}`;
    await projectHelper.createProject(projectName);
    
    // Locate the project card and click Open Project
    const projectCard = page.locator('div.rounded-xl', { has: page.locator(`h3:has-text("${projectName}")`) }).first();
    await projectCard.locator('a:has-text("Open Project")').click();

    // 1. Create Task
    const taskTitle = `Task - ${Date.now()}`;
    const taskDesc = 'Initial task description';
    await taskHelper.createTask(taskTitle, taskDesc);

    // Verify task appears in the list (Default status is ToDo / 'Yapılacak')
    const taskLocator = page.locator(`text=${taskTitle}`);
    await expect(taskLocator).toBeVisible();

    // 2. Update Task
    const updatedTitle = `Updated ${taskTitle}`;
    // TaskStatus.Done is 2, TaskPriority.High is 2
    await taskHelper.updateTask(taskTitle, updatedTitle, '2', '2');

    // Verify updated task is visible
    const updatedTaskLocator = page.locator(`text=${updatedTitle}`);
    await expect(updatedTaskLocator).toBeVisible();

    // 3. Delete Task
    await taskHelper.deleteTask(updatedTitle);

    // Verify task disappears from list
    await expect(updatedTaskLocator).not.toBeVisible();
  });
});
