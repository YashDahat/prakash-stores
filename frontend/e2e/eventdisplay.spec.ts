import { test, expect } from '@playwright/test';

test('owner can create a new membership plan', async ({ page }) => {
  // Login as owner
  await page.goto('/login');
  await page.getByTestId('email-input').fill('owner@example.com');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/dashboard');

  // Navigate to membership plans page
  await page.getByTestId('memberships-link').click();
  await expect(page).toHaveURL('/memberships');

  // Click 'Create New Plan' button
  await page.getByTestId('create-plan-button').click();
  await expect(page).toHaveURL('/memberships/new');

  // Fill out the new plan form
  await page.getByTestId('plan-name-input').fill('Premium Monthly');
  await page.getByTestId('plan-description-input').fill('Access to all features, billed monthly.');
  await page.getByTestId('plan-price-input').fill('29.99');
  await page.getByTestId('plan-interval-select').selectOption('monthly');
  await page.getByTestId('plan-features-input').fill('Feature A, Feature B, Feature C');

  // Submit the form
  await page.getByTestId('submit-plan-button').click();

  // Assert redirection to memberships list and the new plan is visible
  await expect(page).toHaveURL('/memberships');
  await expect(page.getByTestId('plan-card-Premium Monthly')).toBeVisible();
});
