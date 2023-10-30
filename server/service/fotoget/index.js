import {
    createDirectoryOnServer,
    isAvailableFunds,
    getAccess, getCountFiles, splitFilesIntoPackages,
} from "~/server/order/file-manager";
import puppeteer from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import {removeFromQueue} from "~/server/order/queue";
import {socketDownload} from "~/server/utils/socket.io";
import axios from "axios";
import {TableRequest} from "~/server/service/fotoget/utils/fotoget";
import {TableVariants} from "~/server/service/fotoget/utils/fotogetVariants";
import client from "~/server/prisma";
import {JSDOM} from "jsdom";
import * as stream from "stream";
import {promisify} from 'util';
const pipeline = promisify(stream.pipeline)
import got from "got";
import {fileTypeStream} from "file-type";
import path from "path";
import fs from "fs";
import request from "request";

export default async ({source, files, queueId, purchaseId}) => {
    const access = await getAccess(source)
    if (!access) return false

    let isFunds = await isAvailableFunds(files, access)
    if (!isFunds) return false // TODO (сервис недоступен)
    // TODO & тут разве прохожу?!

    let isCreated = await createDirectoryOnServer(purchaseId, files)
    if (!isCreated) return false

    let allPackSource = {}

    let cntFiles = getCountFiles(files)

    if (cntFiles > 10) {
        files = splitFilesIntoPackages(files, 10)
    } else {
        files = [files]
    }

    const {browser, page} = await start()

    for (let item in files) {
        let pack = files[item]

        let session = await checkSession({page, access})
        if (!session) {
            let {cookie, result} = await auth({page, access})
            if (result) access.cookie = cookie
        }

        await setToCart({files: pack, page})
        return false
        await buy({files: pack, page})

    }



    return false


    // TODO it's WORK!
    // let req = await request.get('https://fotoget.org/site/downloadImage/cc58bcfe6fb3f1db0d018df046cc12a2.zip')
    //
    // const write = await fs.createWriteStream('123123123.zip')
    //     .on('close', function () {
    //         console.log('File written!');
    //     })
    //
    // await pipeline(req, write)








    await page.click("li[aria-controls='ordertabs1']")
    await page.waitForSelector("#ordertabs1 .basket.table_view .item.item_pic")

    // console.log(JSON.stringify(files, null, 2))

    // TODO прогонять evaluate в цикле по таймауту, доставая rel (менять массив где достал, где скачал)
    // отдавать результат промежуточный сюда, а здесь request.get(rel) (ставить что скачал и так по циклу ^)


    await page.evaluate(() => {
        console.log('evaluating')
        // waiting for add
        const files = document.querySelectorAll("#ordertabs1 .basket.table_view .item.item_pic")
        // console.log(files)

        const iter = (files) => {
            files.forEach(async (file) => {
                let download = file.querySelector("button.download_img")
                let id = file.querySelector(".articul a").innerText.replace('№ ', '').trim()
                let rel = download.getAttribute('rel')
                if (rel) {
                    // console.log(file)
                    // console.log(id, rel)
                } else {
                    return iter(files)
                }
            })
        }


        iter(files)
        // setTimeout(() => {
        //     iter(files)
        // }, 10000)
    })






}

const start = async () => {
    try {
        puppeteer.use(StealthPlugin())
        puppeteer.use(
            RecaptchaPlugin({
                provider: {
                    id: '2captcha',
                    token: 'f9520650dbfcdcfd7add810058941662'
                },
                visualFeedback: true
            })
        )
        // TODO & headless: 'new' && null
        let browser = await puppeteer.launch({headless: false, args: [`--window-size=1920,1080`], defaultViewport: {width: 1920, height: 1080}})
        let page = await browser.newPage()
        return {browser, page}
    } catch (e) {
        console.log('fotoget start', e)
        return {result: false}
    }
}

const auth = async ({page, access}) => {

    let configForWait = {timeout: 15000}

    try {
        const signButton = "a[data-action='show-login-form']:has([src='/images/mm7.png'])"
        await page.waitForSelector(signButton, configForWait)
        await page.click(signButton)

        await page.waitForSelector("#login_form_open #login-form", configForWait)

        // TODO & вынести в файл или из БД брать
        await page.evaluate(() => {
            const email = document.querySelector("#login-form #password[name='User[login]']")
            email.value = '' // TODO

            const pass = document.querySelector("#login-form #password[name='User[pass]']")
            pass.value = '' // TODO
        })

        await page.solveRecaptchas()
        await page.waitForSelector("#login_form_open [value='Sign in']", configForWait)
        await page.click("#login_form_open [value='Sign in']")

        await page.waitForSelector("[href='/site/logout']", configForWait)
        let cookies = await page.cookies()
        return {result: true, cookie: await getCookie({cookies, access})}
    } catch (e) {
        console.log(`fotoget auth`, e)
        return {result: false}
    }
}

async function getCookie({cookies, access}) {
    let newCookies = ''

    cookies.forEach((item, i) => {
        if (i != 0) newCookies += '; '
        newCookies += `${item.name}=${item.value}`
    })

    try {
        await client.source.updateMany({
            where: {
                name: access.name,
            },
            data: {
                cookie: newCookies
            }
        })

        return newCookies
    } catch (e) {
        console.log(`fotoget getCookie`, e)
        return null
    }

}

const checkSession = async ({page, access}) => {
    await page.goto(access.url, {waitUntil: "domcontentloaded"})

    if (!access.cookie) return false
    let cookies = access.cookie.split('; ').map(item => {
        let [name, value] = item.split('=')
        return {
            name,
            value
        }
    })
    await page.setCookie(...cookies)
    await page.reload({waitUntil: "domcontentloaded"})

    await page.waitForSelector(".username", {timeout: 15000})
    return await page.evaluate(() => {
        let username = document.querySelector('.username')?.innerHTML?.trim()
        return username == 'Nina Fedorova' // TODO & вынести в файл или из БД брать
    })
}

const updatePrice = async () => {}

const setToCart = async ({files, page}) => {

    const sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }

    const waitForBasket = async ({requestItem, id, type, isRepeat = false, cnt = 0}) => {
        let timeout = isRepeat ? 30000 : 15000

        if (cnt == 4) return false

        if (isRepeat) {
            await page.reload({waitUntil: "domcontentloaded"})
            cnt++
        }

        await sleep(1000)

        try {
            await page.waitForSelector(`[aria-controls='${requestItem}']`, {timeout})
            await page.click(`[aria-controls='${requestItem}']`)
            await page.waitForSelector(`#${requestItem} .img`, {timeout})
            await page.focus(`#${requestItem} .img`)
            await page.keyboard.type(id)
        } catch (e) {
            console.log(e)
            return false
        }

        try {
            if (type == 'ADOBESTOCK_HD' || type == 'ADOBESTOCK_4K') {
                await page.waitForSelector(`#${requestItem} .basket .leave button`, {timeout})
                await page.evaluate(({TableVariants, type}) => {
                    let types = document.querySelectorAll('#download_from_adobestockvideo .basket .item_pic')
                    for (let item of types) {
                        let textFileType = item.querySelector('.name').innerText
                        if (TableVariants[type] == textFileType) {
                            item.querySelector('.leave button').click()

                            let remainder = document.querySelectorAll('#download_from_adobestockvideo .basket .item_pic')
                            remainder.forEach(item => item.querySelector('.delete').click())
                            return
                        }
                    }
                }, {TableVariants, type})
            } else {
                try {
                    await page.waitForSelector(`#${requestItem} .basket .leave button`, {timeout})
                    await page.click(`#${requestItem} .basket .leave button`)
                } catch (e) {
                    console.log(e)
                    return false
                }
            }
        } catch (e) {
            return await waitForBasket({requestItem, isRepeat: true, cnt})
        }

        return true
    }

    for (let stock in files) {
        for (let type in files[stock]) {
            let filesType = files[stock][type]

            for (const item of filesType) {
                if (!item.hasAlready) {
                    let requestItem = TableRequest[stock][type]
                    item.inCart = await waitForBasket({requestItem, id: item.id, type})
                }
            }
        }
    }

    await page.click("li[aria-controls='ordertabs2']")
}


const buy = async ({files, page, isRepeat = false, cnt = 0}) => {

    if (isRepeat) {
        await page.reload({waitUntil: "domcontentloaded"})
        cnt++
    }

    try {
        await page.waitForSelector("#buyAllFav", {timeout: 15000})

        await page.evaluate(({files}) => {

            let items = document.querySelectorAll("#ordertabs2 .basket .item_pic")

            // for (let stock in files) {w
            //     for (let type in files[stock]) {
            //         let filesType = files[stock][type]
            //
            //
            //     }
            // }

        }, {files})
    } catch (e) {
        return await buy({page})
    }

    await page.evaluate(() => {
        window.confirm = () => true
        document.querySelector("#buyAllFav").click()
    })
}