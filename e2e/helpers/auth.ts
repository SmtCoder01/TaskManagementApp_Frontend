import { Page } from '@playwright/test';

export class AuthHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async register(name: string, lastName: string, email: string, password: string) {
    await this.page.goto('/register');
    await this.page.fill('#name', name);
    await this.page.fill('#lastName', lastName);
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]'); // 'Create Account' button
    
    // Wait for registration redirection (RegisterPage has a 2-second timeout before navigating)
    await this.page.waitForURL(/\/login/, { timeout: 5000 });
  }

  async login(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]'); // 'Sign In' button
    
    // Wait for login redirection to dashboard
    await this.page.waitForURL(/\/(workspaces)?$/, { timeout: 10000 });
  }

  async logout() {
    await this.page.click('#user-menu-button');
    await this.page.click('button:has-text("Sign Out")');
    await this.page.waitForURL(/\/login/, { timeout: 5000 });
  }
}
