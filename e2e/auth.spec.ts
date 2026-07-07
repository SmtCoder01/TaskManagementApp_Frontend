import { test, expect } from '@playwright/test';
import { AuthHelper } from './helpers/auth';

test.describe('Authentication Smoke Test', () => {
  test('should register, login, and logout successfully', async ({ page }) => {
    const auth = new AuthHelper(page);
    const email = `user-${Date.now()}@example.com`;
    const password = 'Password123*';
    const firstName = 'Test';
    const lastName = 'User';

    // 1. Register
    await auth.register(firstName, lastName, email, password);
    
    // Expect redirection to login or a success message
    await expect(page).toHaveURL(/\/login/);
    
    // 2. Login
    await auth.login(email, password);
    
    // Expect redirection to dashboard/workspaces
    await expect(page).toHaveURL(/\/(workspaces)?$/);

    // 3. Logout
    await auth.logout();
    
    // Expect redirection to login
    await expect(page).toHaveURL(/\/login/);
  });
});
