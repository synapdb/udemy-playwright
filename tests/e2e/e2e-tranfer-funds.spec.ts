import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'
import { validUser } from '../../fixtures/users'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'

test.describe('Tranfer funds and make payments flow', () => {
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

    test('Transfer funds', async ({ page }) => {
        // Given
        await page.click('#transfer_funds_tab')
        await page.selectOption('#tf_fromAccountId', '2')
        await page.selectOption('#tf_toAccountId', '1')
        await page.fill('#tf_amount', '500')
        await page.fill('#tf_description', 'Test transfer from Saving to Checking accounts')

        // When
        await page.click('button[type="submit"]')

        // Then
        const boardHeader = await page.locator('h2.board-header')
        await expect(boardHeader).toContainText('Verify')
        const description = await page.locator('#tf_description')
        await expect(description).toHaveValue('Test transfer from Saving to Checking accounts')
        const amount = await page.locator('#tf_amount')
        await expect(amount).toHaveValue('500')
        const fromAccount = await page.locator('[name="fromAccountId"]')
        await expect(fromAccount).toHaveValue('2')
        const toAccount = await page.locator('[name="toAccountId"]')
        await expect(toAccount).toHaveValue('1')

        // When
        await page.click('button[type="submit"]')

        // Then
        const confirmationMessage = page.locator('.alert-success')
        await expect(confirmationMessage).toContainText('You successfully submitted your transaction.')
    })
})