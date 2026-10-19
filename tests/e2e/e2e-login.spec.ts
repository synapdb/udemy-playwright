import { test, expect } from '@playwright/test'

test.describe.parallel('Login / Logout flow', () => {
    // Before Hook
    test.beforeEach(async ({ page }) => {
        // After a successful login the site redirects to
        // /auth/accept-certs.html?user_token=..., which in turn redirects to an HTTPS
        // URL whose TLS config modern Chrome rejects (ERR_SSL_VERSION_OR_CIPHER_MISMATCH).
        // The session is already authenticated at that point, so we skip that step by
        // sending the browser straight to the account summary. The trailing '*'
        // is needed to match the query string.
        await page.route('**/auth/accept-certs.html*', route =>
            route.fulfill({
                status: 302,
                headers: { location: 'http://zero.webappsecurity.com/bank/account-summary.html' },
            })
        )

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