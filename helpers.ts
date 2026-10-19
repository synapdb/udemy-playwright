import { Page } from "@playwright/test";

export async function loadHomepage(page: Page) {
    await page.goto('https://example-replica.netlify.app/')
}

export async function assertTitle(page: Page) {
    await page.waitForSelector('h1')
}

/**
 * After a successful login the site redirects to
 * /auth/accept-certs.html?user_token=..., which in turn redirects to an HTTPS
 * URL whose TLS config modern Chrome rejects (ERR_SSL_VERSION_OR_CIPHER_MISMATCH).
 * The session is already authenticated at that point, so we skip that step by
 * sending the browser straight to the account summary. The trailing '*'
 * is needed to match the query string.
 *
 * Call this before the login is submitted.
 */
export async function skipAcceptCertsRedirect(page: Page) {
    await page.route('**/auth/accept-certs.html*', route =>
        route.fulfill({
            status: 302,
            headers: { location: 'http://zero.webappsecurity.com/bank/account-summary.html' },
        })
    )
}