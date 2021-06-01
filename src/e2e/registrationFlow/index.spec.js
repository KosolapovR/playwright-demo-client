const fs = require('fs')
const PNG = require('pngjs').PNG
const path = require('path')
const pixelmatch = require('pixelmatch')
const chalk = require('chalk')
const { chromium } = require('playwright')

jest.setTimeout(30_000)

describe('registration flow', () => {
    test('registrationflow renderes correctly', async () => {
        const baseUrl = 'http://localhost:3000'
        const browser = await chromium.launch()
        const page = await browser.newPage()
        const screenshotsPath = path.resolve(__dirname + '/screenshots')
        await page.goto(baseUrl)

        //action
        const action = process.argv[5]

        let landingScreenshotBuffer
        if (
            action === 'update' ||
            !fs.existsSync(`${screenshotsPath}/landing[${chromium.name()}].png`)
        ) {
            landingScreenshotBuffer = await page.screenshot({
                path: `${screenshotsPath}/landing[${chromium.name()}].png`,
            })
            console.log(chalk.blue('screenshot was updated!'))
        } else {
            landingScreenshotBuffer = await page.screenshot()
        }

        const img1 = PNG.sync.read(
            fs.readFileSync(
                `${screenshotsPath}/landing[${chromium.name()}].png`
            )
        )
        const img2 = PNG.sync.read(landingScreenshotBuffer)
        const { width, height } = img1
        const diff = new PNG({ width, height })

        const isScreenshotChanged = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            {
                threshold: 0.1,
            }
        )

        if (isScreenshotChanged) {
            fs.writeFileSync(
                `${screenshotsPath}/landingDiff[${chromium.name()}].png`,
                PNG.sync.write(diff)
            )
        } else {
            if (
                fs.existsSync(
                    `${screenshotsPath}/landingDiff[${chromium.name()}].png`
                )
            )
                fs.unlinkSync(
                    `${screenshotsPath}/landingDiff[${chromium.name()}].png`
                )
        }

        await page.click('"Sign In"')

        await page.click('text=/register/i')

        await page.screenshot({
            path: `${screenshotsPath}/register[${chromium.name()}].png`,
        })

        await page.fill('#login', `test-user_${chromium.name()}`)
        await page.fill('#email', `test-user_${chromium.name()}@mail.ru`)
        await page.fill('#password', '123456')

        await page.click('text=/submit/i')

        await page.waitForResponse(async (response) => {
            if (response.url() === 'http://localhost:8080/user/') {
                const { error, errorMessage, data } = await response.json()

                if (error) {
                    console.log(chalk.cyan(errorMessage))
                } else {
                    await page.evaluate(
                        'window.fetch("http://localhost:8080/user/' +
                            data._id +
                            '", { method: "DELETE" })'
                    )
                }
            }

            return response
        })

        await page.waitForURL(`${baseUrl}/dashboard`)

        await page.screenshot({
            path: `${screenshotsPath}/dashboard[${chromium.name()}].png`,
        })

        await browser.close()
        expect(isScreenshotChanged).toEqual(0)
    })

    test('user register and redirect to dashboard', async () => {
        const baseUrl = 'http://localhost:3000'
        const browser = await chromium.launch()
        const page = await browser.newPage()

        await page.goto(baseUrl)

        await page.click('"Sign In"')

        await page.click('text=/register/i')

        await page.fill('#login', `test-user_${chromium.name()}`)
        await page.fill('#email', `test-user_${chromium.name()}@mail.ru`)
        await page.fill('#password', '123456')

        await page.click('text=/submit/i')

        await page.waitForResponse(async (response) => {
            if (response.url() === 'http://localhost:8080/user/') {
                const { error, errorMessage, data } = await response.json()

                if (error) {
                    console.log(chalk.cyan(errorMessage))
                } else {
                    await page.evaluate(
                        'window.fetch("http://localhost:8080/user/' +
                            data._id +
                            '", { method: "DELETE" })'
                    )
                }
            }

            return response
        })

        await page.waitForURL(`${baseUrl}/dashboard`)

        const dashboardTitle = await page.textContent('span:first-child')

        expect(dashboardTitle).toEqual('Dashboard page')

        await browser.close()
    })
})
