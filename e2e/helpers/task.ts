import { Page } from '@playwright/test';

export class TaskHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createTask(title: string, description: string = '', priority: string = '1') {
    // Open new task modal
    await this.page.click('button:has-text("Yeni Görev")');
    
    // Fill task title
    await this.page.fill('#task-title', title);
    
    // Fill description
    if (description) {
      await this.page.fill('#task-desc', description);
    }
    
    // Select priority
    await this.page.selectOption('#task-priority', priority);
    
    // Submit form using native requestSubmit on the form element
    await this.page.locator('form').evaluate((form) => (form as HTMLFormElement).requestSubmit());
  }

  async updateTask(existingTitle: string, newTitle: string, newStatus: string = '1', newPriority: string = '1') {
    // Click on the existing task card to open edit modal
    await this.page.click(`text=${existingTitle}`);
    
    // Update fields
    await this.page.fill('#task-title', newTitle);
    await this.page.selectOption('#task-status', newStatus);
    await this.page.selectOption('#task-priority', newPriority);
    
    // Submit form using native requestSubmit on the form element
    await this.page.locator('form').evaluate((form) => (form as HTMLFormElement).requestSubmit());
  }

  async deleteTask(title: string) {
    // Click on the task card to open edit modal
    await this.page.click(`text=${title}`);
    
    // Set up dialog handler before clicking delete
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Click delete button
    await this.page.click('button:has-text("Sil")');
  }
}
