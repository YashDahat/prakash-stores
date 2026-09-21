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

  // Click on "Create New Plan" button
  await page.getByTestId('create-plan-button').click();
  await expect(page).toHaveURL('/memberships/new');

  // Fill out the form for a new membership plan
  await page.getByTestId('plan-name-input').fill('Premium Monthly');
  await page.getByTestId('plan-description-input').fill('Access to all features, billed monthly.');
  await page.getByTestId('plan-price-input').fill('29.99');
  await page.getByTestId('plan-interval-select').selectOption('monthly');
  await page.getByTestId('plan-features-input').fill('Feature A, Feature B, Feature C');

  // Submit the form
  await page.getByTestId('save-plan-button').click();

  // Assert that the user is redirected to the memberships list and the new plan is visible
  await expect(page).toHaveURL('/memberships');
  await expect(page.getByTestId('plan-card-Premium Monthly')).toBeVisible();
});

test('owner can edit an existing membership plan', async ({ page }) => {
  // Login as owner
  await page.goto('/login');
  await page.getByTestId('email-input').fill('owner@example.com');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL('/dashboard');

  // Navigate to membership plans page
  await page.getByTestId('memberships-link').click();
  await expect(page).toHaveURL('/memberships');

  // Click on the edit button for an existing plan (assuming 'Basic Monthly' exists)
  await page.getByTestId('edit-plan-button-Basic Monthly').click();
  await expect(page).toHaveURL(/\/memberships\/edit\/.+/); // URL should be /memberships/edit/:id

  // Update the plan description
  await page.getByTestId('plan-description-input').fill('Updated description for Basic Monthly plan.');
  await page.getByTestId('plan-price-input').fill('15.00'); // Change price

  // Submit the form
  await page.getByTestId('save-plan-button').click();

  // Assert that the user is redirected to the memberships list and the changes are reflected
  await expect(page).toHaveURL('/memberships');
  // Re-navigate to the edit page to assert the input value, or check a visible element if available
  // For this example, we'll assume the list view might show a summary, but a more robust check would be to re-edit.
  await page.getByTestId('edit-plan-button-Basic Monthly').click();
  await expect(page.getByTestId('plan-description-input')).toHaveValue('Updated description for Basic Monthly plan.');
  await expect(page.getByTestId('plan-price-input')).toHaveValue('15.00');
});
