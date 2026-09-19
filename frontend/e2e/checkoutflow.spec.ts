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
    await expect(page.getByTestId('memberships-page-title')).toBeVisible();
    await expect(page.getByTestId('membership-list')).toBeVisible();
  });

  test('should allow an admin to create a new membership plan', async ({ page }) => {
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
    await expect(page.getByTestId('new-membership-form')).toBeVisible();

    // Fill out the form
    await page.getByTestId('membership-name-input').fill('Premium Plan');
    await page.getByTestId('membership-price-input').fill('99.99');
    await page.getByTestId('membership-duration-input').fill('12');
    await page.getByTestId('membership-description-input').fill('Full access to all features for a year.');
    await page.getByTestId('membership-features-input').fill('Feature A, Feature B, Feature C');

    // Submit the form
    await page.getByTestId('submit-membership-button').click();

    // Assert redirection and new membership visibility
    await expect(page).toHaveURL('/admin/memberships');
    await expect(page.getByTestId('membership-list')).toBeVisible();
    await expect(page.getByTestId('membership-item-Premium Plan')).toBeVisible();
  });
});
