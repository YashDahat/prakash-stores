import { test, expect } from '@playwright/test';

test.describe('Admin Membership Management', () => {
  test('should allow an admin to log in and view the memberships page', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('adminpassword');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/admin/dashboard');

    // Navigate to memberships page
    await page.getByTestId('admin-memberships-link').click();
    await expect(page).toHaveURL('/admin/memberships');
    await expect(page.getByTestId('memberships-table')).toBeVisible();
  });

  test('should allow an admin to create a new membership', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('adminpassword');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/admin/dashboard');

    // Navigate to memberships page
    await page.getByTestId('admin-memberships-link').click();
    await expect(page).toHaveURL('/admin/memberships');

    // Click create new membership button
    await page.getByTestId('create-membership-button').click();
    await expect(page).toHaveURL('/admin/memberships/new');

    // Fill out the form
    await page.getByTestId('membership-name-input').fill('Premium Monthly');
    await page.getByTestId('membership-price-input').fill('29.99');
    await page.getByTestId('membership-duration-input').fill('30');
    await page.getByTestId('membership-description-input').fill('Access to all premium features for one month.');
    await page.getByTestId('membership-active-checkbox').check();

    // Submit the form
    await page.getByTestId('submit-membership-button').click();

    // Assert redirection and new membership visibility
    await expect(page).toHaveURL('/admin/memberships');
    await expect(page.getByTestId('memberships-table')).toBeVisible();
    await expect(page.getByTestId('membership-row-Premium Monthly')).toBeVisible();
  });

  test('should allow an admin to edit an existing membership', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('adminpassword');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/admin/dashboard');

    // Navigate to memberships page
    await page.getByTestId('admin-memberships-link').click();
    await expect(page).toHaveURL('/admin/memberships');

    // Click edit button for a specific membership (assuming 'Basic Monthly' exists from seed data or prior test)
    await page.getByTestId('edit-membership-button-Basic Monthly').click();
    await expect(page).toHaveURL(/\/admin\/memberships\/.+\/edit/); // URL should contain an ID

    // Edit the form fields
    await page.getByTestId('membership-price-input').fill('12.99');
    await page.getByTestId('membership-description-input').fill('Updated basic access for one month.');

    // Submit the form
    await page.getByTestId('submit-membership-button').click();

    // Assert redirection and updated membership visibility
    await expect(page).toHaveURL('/admin/memberships');
    await expect(page.getByTestId('memberships-table')).toBeVisible();
    await expect(page.getByTestId('membership-row-Basic Monthly')).toBeVisible();
    // Optionally, assert the updated price is visible in the table if a specific cell can be targeted
  });

  test('should allow an admin to delete an existing membership', async ({ page }) => {
    // Log in as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@example.com');
    await page.getByTestId('password-input').fill('adminpassword');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/admin/dashboard');

    // Navigate to memberships page
    await page.getByTestId('admin-memberships-link').click();
    await expect(page).toHaveURL('/admin/memberships');

    // Click delete button for a specific membership (assuming 'Free Trial' exists)
    await page.getByTestId('delete-membership-button-Free Trial').click();

    // Confirm deletion if a confirmation dialog appears (example using a generic confirm button)
    // If there's a specific testid for a confirm button in a dialog, use that.
    // For now, assuming direct deletion or an implicit confirmation.
    // await page.getByTestId('confirm-delete-button').click();

    // Assert the membership is no longer visible
    await expect(page.getByTestId('membership-row-Free Trial')).not.toBeVisible();
  });
});
