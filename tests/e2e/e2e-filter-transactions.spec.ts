import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'
import { validUser } from '../../fixtures/users'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'

test.describe('Filter transactions flow', () => {
    let homePage: HomePage
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        loginPage = new LoginPage(page)

        await skipAcceptCertsRedirect(page)

        await homePage.visit()
        await homePage.clickOnSignIn()
        await loginPage.login(validUser)
    })

    test('Verify the results for each account transaction', async ({ page }) => {
        // Given
        await page.click('#account_activity_tab')

        // When
        await page.selectOption('#aa_accountId', '2')

        // Then
        const checkingAccount = await page.locator('#all_transactions_for_account tbody tr')
        await expect(checkingAccount).toHaveCount(3)

        await page.selectOption('#aa_accountId', '4')
        const loanAccount = await page.locator('#all_transactions_for_account tbody tr')
        await expect(loanAccount).toHaveCount(2)

        await page.selectOption('#aa_accountId', '6')
        const noResult = await page.locator('.well')
        await expect(noResult).toBeVisible()
        await expect(noResult).toContainText('No results.')
    })
})