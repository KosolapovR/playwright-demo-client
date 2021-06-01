const playwright = require('playwright')
const fs = require('fs')
const PNG = require('pngjs').PNG
const pixelmatch = require('pixelmatch')
const chalk = require('chalk')
jest.setTimeout(20_000)

test('authflow renderes correctly', async () => {
    const baseUrl = 'http://localhost:3000'
    const screenshotsPath = 'src/e2e/authFlow/screenshots'
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
        const browser = await playwright[browserType].launch()
        const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto(baseUrl)

        //action
        const action = process.argv[2]

        let landingScreenshotBuffer
        if (
            action === 'update' ||
            !fs.existsSync(`${screenshotsPath}/landing[${browserType}].png`)
        ) {
            landingScreenshotBuffer = await page.screenshot({
                path: `${screenshotsPath}/landing[${browserType}].png`,
            })
            console.log(chalk.blue('screenshot was updated!'))
        } else {
            landingScreenshotBuffer = await page.screenshot()
        }

        const img1 = PNG.sync.read(
            fs.readFileSync(`${screenshotsPath}/landing[${browserType}].png`)
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
                `${screenshotsPath}/landingDiff[${browserType}].png`,
                PNG.sync.write(diff)
            )
        } else {
            if (
                fs.existsSync(
                    `${screenshotsPath}/landingDiff[${browserType}].png`
                )
            )
                fs.unlinkSync(
                    `${screenshotsPath}/landingDiff[${browserType}].png`
                )
        }

        await page.click('"Sign In"')

        await page.fill('#login', 'admin')
        await page.fill('#password', '123456')

        await page.screenshot({
            path: `${screenshotsPath}/login[${browserType}].png`,
        })

        await page.click('"Submit"')

        await page.waitForURL(`${baseUrl}/dashboard`)

        await page.screenshot({
            path: `${screenshotsPath}/dashboard[${browserType}].png`,
        })

        await browser.close()
        expect(isScreenshotChanged).toEqual(0)
    }
})
