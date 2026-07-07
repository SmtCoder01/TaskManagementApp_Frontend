import { Page } from '@playwright/test';

export class ProjectHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createProject(name: string, description: string = '') {
    // Open project creation modal
    await this.page.click('button:has-text("New Project")');
    
    // Fill form
    await this.page.fill('#project-name', name);
    if (description) {
      await this.page.fill('#project-description', description);
    }
    
    // Submit form using native requestSubmit on the form element
    await this.page.locator('form').evaluate((form) => (form as HTMLFormElement).requestSubmit());
  }
}
