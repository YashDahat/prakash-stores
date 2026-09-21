import { test, expect } from '@playwright/test';

test.describe('Owner Onboarding', () => {
  test('should allow an owner to complete onboarding after login', async ({ page }) => {
    // Login as owner
    await page.goto('/login');
    await page.getByTestId('email-input').fill('owner@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/onboarding');

    // Step 1: Welcome
    await expect(page.getByTestId('onboarding-welcome-title')).toBeVisible();
    await page.getByTestId('onboarding-next-button').click();

    // Step 2: Business Info
    await expect(page.getByTestId('onboarding-business-name-input')).toBeVisible();
    await page.getByTestId('onboarding-business-name-input').fill('My Awesome Business');
    await page.getByTestId('onboarding-business-type-select').selectOption('restaurant');
    await page.getByTestId('onboarding-next-button').click();

    // Step 3: Contact Info
    await expect(page.getByTestId('onboarding-contact-email-input')).toBeVisible();
    await page.getByTestId('onboarding-contact-email-input').fill('contact@myawesomebusiness.com');
    await page.getByTestId('onboarding-contact-phone-input').fill('555-123-4567');
    await page.getByTestId('onboarding-next-button').click();

    // Step 4: Address Info
    await expect(page.getByTestId('onboarding-address-street-input')).toBeVisible();
    await page.getByTestId('onboarding-address-street-input').fill('123 Main St');
    await page.getByTestId('onboarding-address-city-input').fill('Anytown');
    await page.getByTestId('onboarding-address-state-input').fill('CA');
    await page.getByTestId('onboarding-address-zip-input').fill('90210');
    await page.getByTestId('onboarding-next-button').click();

    // Step 5: Review and Submit
    await expect(page.getByTestId('onboarding-review-title')).toBeVisible();
    await expect(page.getByTestId('onboarding-review-business-name')).toHaveText('My Awesome Business');
    await expect(page.getByTestId('onboarding-review-business-type')).toHaveText('Restaurant');
    await expect(page.getByTestId('onboarding-review-contact-email')).toHaveText('contact@myawesomebusiness.com');
    await expect(page.getByTestId('onboarding-review-contact-phone')).toHaveText('555-123-4567');
    await expect(page.getByTestId('onboarding-review-address')).toContainText('123 Main St, Anytown, CA 90210');
    await page.getByTestId('onboarding-submit-button').click();

    // Assert successful completion and redirection to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('dashboard-welcome-message')).toBeVisible();
  });
});
