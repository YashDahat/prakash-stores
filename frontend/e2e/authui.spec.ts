import { test, expect } from '@playwright/test';

test.describe('Owner Onboarding and Workspace Creation', () => {
  test('should allow an owner to complete onboarding and create a workspace', async ({ page }) => {
    // Log in as an owner
    await page.goto('/login');
    await page.getByTestId('login-email-input').fill('owner@example.com');
    await page.getByTestId('login-password-input').fill('password123');
    await page.getByTestId('login-submit-button').click();
    await expect(page).toHaveURL('/onboarding');

    // Complete onboarding steps
    await page.getByTestId('onboarding-name-input').fill('Test Owner');
    await page.getByTestId('onboarding-phone-input').fill('555-123-4567');
    await page.getByTestId('onboarding-address-input').fill('123 Main St');
    await page.getByTestId('onboarding-city-input').fill('Anytown');
    await page.getByTestId('onboarding-state-input').fill('CA');
    await page.getByTestId('onboarding-zip-input').fill('90210');
    await page.getByTestId('onboarding-submit-button').click();
    await expect(page).toHaveURL('/onboarding/workspace');

    // Create a workspace
    await page.getByTestId('workspace-name-input').fill('My Test Workspace');
    await page.getByTestId('workspace-description-input').fill('A workspace for testing purposes.');
    await page.getByTestId('workspace-submit-button').click();

    // Assert successful redirection to the dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('dashboard-header')).toBeVisible();
  });
});
