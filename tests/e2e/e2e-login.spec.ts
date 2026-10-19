import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'

test.describe.parallel('Login / Logout flow', () => {
    // Before Hook
    test.beforeEach(async ({ page }) => {
        await skipAcceptCertsRedirect(page)
        await page.goto('http://zero.webappsecurity.com/')
    })

    //Negative Scenario
    test('Negative scenario for login', async ({ page }) => {
        // Given
        await page.click('#signin_button')
        await page.fill('#user_login', 'invalid username')
        await page.fill('#user_password', 'invalid password')

        // When
        await page.click('input[type="submit"]')

        // Then
        const errorMessage = page.locator('.alert-error')
        await expect(errorMessage).toHaveText('Login and/or password are wrong.')
    })

    //Positive Scenario
    test('Positive scenario for login + logout flow', async ({ page }) => {
        // Given
        await page.click('#signin_button')
        await page.fill('#user_login', 'username')
        await page.fill('#user_password', 'password')

        // When
        await page.click('input[type="submit"]')

        // Then
        await expect(page).toHaveURL('http://zero.webappsecurity.com/bank/account-summary.html')
        const accountSymmaryTab = await page.locator('#account_summary_tab')
        await expect(accountSymmaryTab).toBeVisible()

        await page.goto('http://zero.webappsecurity.com/logout.html')
        await expect(page).toHaveURL('http://zero.webappsecurity.com/index.html')
        const signinButton = await page.locator('#signin_button')
        await expect(signinButton).toBeVisible()
    })
})