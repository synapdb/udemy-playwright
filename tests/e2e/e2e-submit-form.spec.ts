import { test, expect } from '@playwright/test'

test.describe.parallel('Feedback Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.click('#feedback')
    })

    test('Reset feedback form', async ({ page }) => {
        // Given
        await page.fill('#name', 'John Doe')
        await page.fill('#email', 'john.doe@example.com')
        await page.fill('#subject', 'Test Subject')
        await page.fill('#comment', 'This is a test comment')

        // When
        await page.click('input[value="Clear"]')

        // Then
        await expect(page).toHaveURL('http://zero.webappsecurity.com/feedback.html')
        await expect(page.locator('#name')).toBeEmpty()
        await expect(page.locator('#email')).toBeEmpty()
        await expect(page.locator('#subject')).toBeEmpty()
        await expect(page.locator('#comment')).toBeEmpty()

    })

    test('Submit feedback form', async ({ page }) => {
        // Given
        await page.fill('#name', 'John Doe')
        await page.fill('#email', 'john.doe@example.com')
        await page.fill('#subject', 'Test Subject')
        await page.fill('#comment', 'This is a test comment')

        // When
        await page.click('input[type="submit"]')

        // Then
        await page.waitForSelector('#feedback-title')
        // const feedbackHeading = await page.getByRole('heading', { name: 'Feedback' })
        // await expect(feedbackHeading).toBeVisible()
    })
})