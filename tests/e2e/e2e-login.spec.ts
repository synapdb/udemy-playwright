import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { baseUrl } from '../../fixtures/urls'
import { invalidUser, validUser } from '../../fixtures/users'

test.describe.parallel('Login / Logout flow', () => {
    let homePage: HomePage
    let loginPage: LoginPage

    // Before Hook
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        loginPage = new LoginPage(page)
        await skipAcceptCertsRedirect(page)
        await homePage.visit()
    })

    //Negative Scenario
    test('Negative scenario for login', async () => {
        // Given
        await homePage.clickOnSignIn()

        // When
        await loginPage.login(invalidUser)

        // Then
        await loginPage.assertLoginFailed()
    })

    //Positive Scenario
    test('Positive scenario for login + logout flow', async ({ page }) => {
        // Given
        await homePage.clickOnSignIn()

        // When
        await loginPage.login(validUser)

        // Then
        await expect(page).toHaveURL(`${baseUrl}/bank/account-summary.html`)
        await expect(page.locator('#account_summary_tab')).toBeVisible()

        await loginPage.logout()
        await homePage.assertLoggedOut()
    })
})
