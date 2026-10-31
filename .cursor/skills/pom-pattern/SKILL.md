---
name: pom-pattern
description: Refactors a single Playwright (TypeScript) spec file to the Page Object Model (POM) by extracting page objects, test-data fixtures and a shared base URL, then updating the spec and verifying it. Use when the user asks to apply POM, page objects or fixtures to a specific test file.
disable-model-invocation: true
---

# Refactor a Playwright spec to the Page Object Model

Apply this to **one spec file at a time** (the file the user names). Do not
edit other specs, even if they would benefit. Mention them at the end instead.

## Project layout

```
fixtures/        test data and constants (no Playwright, no selectors)
  urls.ts          export const baseUrl = '...'
  users.ts         User interface + valid/invalid users
page-objects/    one class per page (or major page component)
  HomePage.ts
  LoginPage.ts
tests/**/*.spec.ts   specs: scenarios only (Given / When / Then)
helpers.ts       pre-existing shared helpers - reuse, do not move
```

Match the repo's existing style (read `.prettierrc`: e.g. 4 spaces, no
semicolons, single quotes). Keep existing comments such as `// Given`,
`// When`, `// Then`, and the existing `describe`/`test` names and behavior.

## Step 1 - Read before changing

1. Read the target spec, `package.json`, the relevant Playwright config, and
   any existing `page-objects/`, `fixtures/`, `helpers.ts`, `tsconfig.json`.
2. List every user action and every assertion in the spec, and the page each
   one happens on. Group them **by page**, not by test.
3. Note what is test data (usernames, passwords, URLs, expected text) versus
   selectors versus behavior.
4. Reuse existing helpers and hooks (e.g. a `page.route` workaround called
   in `beforeEach`). Leave them in the spec / helpers; do not bury them
   inside page objects.

## Step 2 - Decide what goes where

| Thing | Goes in |
|---|---|
| Selectors / locators | The page object that owns that element |
| User actions (click, fill, navigate) | Methods on the owning page object |
| Assertions about **that page's own** elements/URL | `assertXxx()` methods on that page object (only if it fits - see rules) |
| Assertions about **another** page | Leave in the spec until that page has its own object |
| Credentials, input data | `fixtures/` |
| Base URL | `fixtures/urls.ts`, imported everywhere - never duplicated |
| Scenario flow, test names, which assertions matter | The spec |

## Step 3 - Page object rules

1. **One class per page.** An element belongs to the page it appears on
   (e.g. the "Sign in" button is on the **HomePage**, the username/password
   inputs are on the **LoginPage**). If a locator is on the wrong page, move
   it rather than expose it across pages.
2. Constructor receives a `Page` and stores it as `readonly page: Page`.
   Locators are `readonly` properties initialised in the constructor, so a
   selector change is a one-line fix:

```ts
import { expect, Locator, Page } from '@playwright/test'
import { baseUrl } from '../fixtures/urls'

export class HomePage {
    readonly page: Page
    readonly signInButton: Locator

    constructor(page: Page) {
        this.page = page
        this.signInButton = page.locator('#signin_button')
    }

    async visit() {
        await this.page.goto(`${baseUrl}/`)
    }

    async clickOnSignIn() {
        await this.signInButton.click()
    }

    async assertLoggedOut() {
        await expect(this.page).toHaveURL(`${baseUrl}/index.html`)
        await expect(this.signInButton).toBeVisible()
    }
}
```

3. **Methods describe user intent**, not mechanics: `login(user)`,
   `clickOnSignIn()`, `logout()` - not `fillUsernameAndClick()`.
4. **Pass data in, never hard-code it.** `login({ username, password }: User)`
   takes a `User` from the fixtures; the page object holds no test data.
5. **Assertions in page objects** are allowed only when they are
   - about the page object's own elements/URL,
   - one outcome per method, named for that outcome (`assertLoginFailed`,
     `assertLoggedOut`),
   - using Playwright web-first assertions (`await expect(locator)...`) - no
     manual waits or `waitForTimeout`.
   Keep generic or one-off checks in the spec (`expect(loginPage.errorMessage)`
   is fine). Never put assertions about page B in page A's object.
6. **No duplication between page objects.** One owner per locator and per
   action (e.g. only `HomePage` has `visit()`; delete the copy from
   `LoginPage`).
7. Page objects must not depend on each other circularly, and must not
   import from specs.
8. Prefer `readonly` + `private` where appropriate; avoid public mutable state.
9. Do not create a `BasePage` unless asked or there is real shared behavior;
   a shared base URL belongs in `fixtures/urls.ts`, not in a class.

## Step 4 - Fixtures (test data) rules

- Own folder (`fixtures/`), own file per concern (`users.ts`, `urls.ts`),
  typed with an interface:

```ts
export interface User {
    username: string
    password: string
}

export const validUser: User = {
    username: process.env.TEST_USERNAME ?? 'username',
    password: process.env.TEST_PASSWORD ?? 'password',
}

export const invalidUser: User = {
    username: 'invalid username',
    password: 'invalid password',
}
```

```ts
// fixtures/urls.ts
export const baseUrl = 'http://example.com'
```

- **Do NOT add `.env` / `.env.example` by default.** Only do it when values
  are genuinely secret. Public demo credentials are not secrets. A
  `process.env.X ?? 'default'` fallback is the lightweight upgrade path.
- If `.env` is introduced later: Playwright does not load it by itself (add
  `dotenv`), and a `.gitignore` rule like `.env.*` also ignores
  `.env.example` - add `!.env.example`.
- If `process` is flagged ("Cannot find name 'process'"), install
  `@types/node` and ensure a `tsconfig.json` has `"types": ["node"]`.
  Newer TypeScript does not auto-load `@types/*`.

## Step 5 - Refactor the spec

1. Import the page objects and fixtures; declare `let xPage: XPage` in the
   `describe` and construct them in `beforeEach` with the `page` fixture.
2. Replace raw `page.click/fill/locator` and hard-coded data with page object
   methods and fixture values. Replace hard-coded URLs with `baseUrl`.
3. Keep the scenario structure, Given/When/Then comments, test names and
   describe mode (`describe.parallel` etc.) unchanged.
4. Drop imports and `page` arguments that become unused (`expect`,
   `{ page }`), and re-add them if some assertions intentionally stay inline.
5. Assertions that belong to a page with no object yet stay inline in the
   spec. Suggest (do not silently create) a new page object for them.

```ts
test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    loginPage = new LoginPage(page)
    await skipAcceptCertsRedirect(page)   // existing helper, unchanged
    await homePage.visit()
})

test('Negative scenario for login', async () => {
    // Given
    await homePage.clickOnSignIn()
    // When
    await loginPage.login(invalidUser)
    // Then
    await loginPage.assertLoginFailed()
})
```

## Step 6 - Verify (always)

1. Type check: `npx -p typescript tsc -p tsconfig.json` (TypeScript may not be
   a project dependency; do not assume a global `tsc`).
2. Run only the refactored spec with the config it belongs to, e.g.
   `npx playwright test --config=<config> --project=chromium <spec-name>`.
   - There is no `--headed=false` flag; headless is set in the config.
   - If the browser executable is "not found" in a sandboxed shell, unset
     `PLAYWRIGHT_BROWSERS_PATH` for that command
     (`env -u PLAYWRIGHT_BROWSERS_PATH npx playwright test ...`).
3. Both type check and tests must pass, and behavior must be unchanged.
4. Check for leftovers: unused imports, unused locators, duplicate methods
   across page objects (`grep` for the old selectors/URLs - none should
   remain in the spec).

## Step 7 - Report

Keep it concise:
- Files created/changed and what each owns.
- Anything deliberately left in the spec and why.
- Leftovers or suggested follow-ups (new page objects, other specs that still
  use raw selectors). Do not edit those unprompted.
- Test + type-check results.

## Guardrails

- Change only what the request implies. Do not fix unrelated errors, edit
  other specs, or change Playwright configs (e.g. adding `baseURL`) unless
  asked; suggest it instead.
- If the user is mid-refactor (files edited between prompts), re-read the
  current file contents before editing and do not overwrite their changes.
- If the user asks to undo, restore the exact previous contents of every file
  touched and delete files you created, then re-run verification.
- If the user's wording is ambiguous or has a typo (e.g. "HopePage"),
  assume the obvious intent from the file names and state the assumption.
- When a premise is wrong (e.g. "the URL is in the fixture" but it is in the
  page objects), say so briefly and then do the intended thing.
