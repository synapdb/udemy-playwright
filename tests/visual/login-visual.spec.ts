import { test } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { validUser, invalidUser } from '../../fixtures/users'


test.describe.only('Login Page Visual Regression', () => {
    let homePage: HomePage
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        loginPage = new LoginPage(page)

        await skipAcceptCertsRedirect(page)
        await homePage.visit()
        await homePage.clickOnSignIn()
    })

    test('Login form should look the same', async () => {

        await loginPage.snapshotLoginForm()
    })

    test('Error message should look the same', async () => {

        await loginPage.login(invalidUser)
        await loginPage.snapshotErrorMessage()
    })
})