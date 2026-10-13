import { test, expect } from '@playwright/test';

test('Simple basic test @basictag', async ({ page }) => {
    await page.goto('https://playwright.dev');
    const title = page.locator('.navbar__inner .navbar__title');
    await expect(title).toHaveText('Playwright');
})

test('Second basic test @basictag', async ({ page }) => {
    await page.goto('https://example-replica.netlify.app/')
    const pageTitle = await page.locator('h1')
    await expect.soft(pageTitle).toHaveText('Example Domain')
})

test('Clicking on Elements', async ({ page }) => {
    await page.goto('http://zero.webappsecurity.com/index.html')
    await page.click("#signin_button")
    //await page.getByRole('button', { name: 'Signin' }).click()

    await page.locator('[name="submit"]').click()
    const errorMessage = await page.locator('.alert-error')
    //const errorMessage = await page.locator('div.alert.alert-error')
    await expect(errorMessage).toContainText('Login and/or password are wrong.')
})

test.skip('Selectors', async ({ page }) => {
    //text
    await page.click('text=Some Text')

    // CSS Selectors
    await page.click('button')
    await page.click('#id')
    await page.click('.class')

    // Only visible CSS Selectors
    await page.click('.submit-button:visible')

    // Combination Selectors
    await page.click('#username .first')

    // XPath Selectors
    await page.click('//button')
    await page.click('//button[text()="Click me"]')
    await page.click('xpath=/html/body/div[1]/button')

    // Attribute Selectors
    await page.click('input[name="q"]')

    // Pseudo-class Selectors
    await page.click('button:has-text("Click me")')
})

test.describe('A test suite for learning the basic of Playwright', () => {
    test('Working with Inputs', async ({ page }) => {
        // Given
        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.click("#signin_button")

        await page.fill('#user_login', 'some username')
        await page.fill('#user_password', 'some password')

        // When
        await page.locator('[name="submit"]').click()

        // Then
        const errorMessage = await page.locator('.alert-error')
        await expect(errorMessage).toContainText('Login and/or password are wrong.')
    })

    test('Assertions', async ({ page }) => {
        // Given
        const urlToTest = 'https://example-replica.netlify.app/'

        // When
        await page.goto(urlToTest)

        // Then
        await expect(page).toHaveURL(urlToTest)
        await expect(page).toHaveTitle('Example Domain')

        const element = page.locator('h1')
        await expect(element).toBeVisible()
        await expect(element).toHaveText('Example Domain')
        await expect(element).toHaveCount(1)

        const nonExistingElement = page.locator('h5')
        await expect(nonExistingElement).not.toBeVisible()

        await expect(element).not.toHaveText('.title')
    })
})

test('Screenshots', async ({ page }) => {
    // 1. Load website
    await page.goto('https://example-replica.netlify.app/')
    // 2. Take a screeshot of full page.
    await page.screenshot({ path: 'screenshot.png', fullPage: true })

    // 3. Take a screeshot of a specific element.
    const element = page.locator('h1')
    await element.screenshot({ path: 'screenshot-element.png' })

    // 4 Take a screeshot of a specific area of the page.
    await page.screenshot({ path: 'screenshot-area.png', fullPage: false })
})