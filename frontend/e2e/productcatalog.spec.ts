import { test, expect } from '@playwright/test';

test.describe('Admin Membership Management', () => {
  test('should allow an admin to log in and view the memberships page', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('adminpassword');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/dashboard');

    // Navigate to memberships page
    await page.getByTestId('memberships-nav-link').click();
    await expect(page).toHaveURL('/memberships');

    // Assert that the memberships list is visible
    await expect(page.getByTestId('memberships-list')).toBeVisible();
  });

  test('should allow an admin to create a new membership', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('adminpassword');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/dashboard');

    // Navigate to memberships page
    await page.getByTestId('memberships-nav-link').click();
    await expect(page).toHaveURL('/memberships');

    // Click the create new membership button
    await page.getByTestId('create-membership-button').click();
    await expect(page).toHaveURL('/memberships/new');

    // Fill out the new membership form
    await page.getByTestId('membership-name-input').fill('Premium Monthly');
    await page.getByTestId('membership-price-input').fill('29.99');
    await page.getByTestId('membership-duration-input').fill('30'); // Days
    await page.getByTestId('membership-description-input').fill('Access to all premium features for a month.');
    await page.getByTestId('save-membership-button').click();

    // Assert redirection to memberships list and the new membership is visible
    await expect(page).toHaveURL('/memberships');
    await expect(page.getByTestId('membership-card-Premium Monthly')).toBeVisible();
  });

  test('should allow an admin to edit an existing membership', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('adminpassword');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/dashboard');

    // Navigate to memberships page
    await page.getByTestId('memberships-nav-link').click();
    await expect(page).toHaveURL('/memberships');

    // Assuming a membership named "Basic Monthly" exists from seeding or a previous test
    await page.getByTestId('edit-membership-button-Basic Monthly').click();
    await expect(page).toHaveURL(/\/memberships\/edit\/.+/); // URL should contain an ID

    // Edit the membership details
    await page.getByTestId('membership-name-input').fill('Basic Monthly - Updated');
    await page.getByTestId('membership-price-input').fill('15.00');
    await page.getByTestId('save-membership-button').click();

    // Assert redirection to memberships list and the updated membership name is visible
    await expect(page).toHaveURL('/memberships');
    await expect(page.getByTestId('membership-card-Basic Monthly - Updated')).toBeVisible();
  });

  test('should allow an admin to delete an existing membership', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('adminpassword');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/dashboard');

    // Navigate to memberships page
    await page.getByTestId('memberships-nav-link').click();
    await expect(page).toHaveURL('/memberships');

    // Assuming a membership named "Free Trial" exists from seeding or a previous test
    await expect(page.getByTestId('membership-card-Free Trial')).toBeVisible();
    await page.getByTestId('delete-membership-button-Free Trial').click();

    // Confirm deletion if a confirmation dialog appears (assuming a simple click for now)
    // In a real app, this might involve clicking a 'confirm' button in a modal.
    // For now, we'll just assert its disappearance.

    // Assert that the membership is no longer visible
    await expect(page.getByTestId('membership-card-Free Trial')).not.toBeVisible();
  });
});
