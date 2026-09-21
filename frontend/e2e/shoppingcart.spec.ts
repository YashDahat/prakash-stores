import { test, expect } from '@playwright/test';

test.describe('Admin Membership Management', () => {
  test('should allow an admin to log in and view the memberships page', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/admin/dashboard');

    // Navigate to memberships page
    await page.getByTestId('memberships-nav-link').click();
    await expect(page).toHaveURL('/admin/memberships');
    await expect(page.getByTestId('memberships-title')).toBeVisible();
    await expect(page.getByTestId('membership-list')).toBeVisible();
  });

  test('should allow an admin to create a new membership plan', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/admin/dashboard');

    // Navigate to memberships page
    await page.getByTestId('memberships-nav-link').click();
    await expect(page).toHaveURL('/admin/memberships');

    // Click 'Add New Membership' button
    await page.getByTestId('add-membership-button').click();
    await expect(page).toHaveURL('/admin/memberships/new');

    // Fill out the form
    await page.getByTestId('membership-name-input').fill('Premium Monthly');
    await page.getByTestId('membership-price-input').fill('29.99');
    await page.getByTestId('membership-duration-input').fill('30'); // Days
    await page.getByTestId('membership-description-input').fill('Access to all premium features for a month.');
    await page.getByTestId('membership-features-input').fill('Feature A, Feature B, Feature C');

    // Submit the form
    await page.getByTestId('save-membership-button').click();

    // Assert redirection and new membership visibility
    await expect(page).toHaveURL('/admin/memberships');
    await expect(page.getByTestId('membership-card-Premium Monthly')).toBeVisible();
  });

  test('should allow an admin to edit an existing membership plan', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password123').fill('password123'); // Assuming password123 is the correct testid for password input
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/admin/dashboard');

    // Navigate to memberships page
    await page.getByTestId('memberships-nav-link').click();
    await expect(page).toHaveURL('/admin/memberships');

    // Assuming a membership 'Basic Monthly' exists from seeding or previous test
    await page.getByTestId('edit-membership-button-Basic Monthly').click();
    await expect(page).toHaveURL(/\/admin\/memberships\/.+\/edit/); // Check for dynamic ID in URL

    // Edit the membership details
    await page.getByTestId('membership-name-input').fill('Basic Monthly - Updated');
    await page.getByTestId('membership-price-input').fill('12.99');
    await page.getByTestId('save-membership-button').click();

    // Assert redirection and updated membership visibility
    await expect(page).toHaveURL('/admin/memberships');
    await expect(page.getByTestId('membership-card-Basic Monthly - Updated')).toBeVisible();
  });

  test('should allow an admin to delete a membership plan', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/admin/dashboard');

    // Navigate to memberships page
    await page.getByTestId('memberships-nav-link').click();
    await expect(page).toHaveURL('/admin/memberships');

    // Assuming a membership 'Free Tier' exists for deletion
    await expect(page.getByTestId('membership-card-Free Tier')).toBeVisible();
    await page.getByTestId('delete-membership-button-Free Tier').click();

    // Confirm deletion if there's a confirmation dialog (example, adjust if not present)
    // await page.getByTestId('confirm-delete-button').click();

    // Assert that the membership is no longer visible
    await expect(page.getByTestId('membership-card-Free Tier')).not.toBeVisible();
  });
});
