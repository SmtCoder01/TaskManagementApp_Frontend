import { Page } from '@playwright/test';

export class WorkspaceHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createWorkspace(name: string, description: string = '') {
    // Navigate to workspaces dashboard/list
    await this.page.goto('/');
    
    // Open creation modal
    await this.page.click('button:has-text("New Workspace")');
    
    // Fill the form
    await this.page.fill('#workspace-name', name);
    if (description) {
      await this.page.fill('#workspace-description', description);
    }
    
    // Submit the form using native requestSubmit on the form element
    await this.page.locator('form').evaluate((form) => (form as HTMLFormElement).requestSubmit());
  }
}
