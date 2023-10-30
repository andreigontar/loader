import puppeteer from 'puppeteer'
import fileType from '@/server/data/file-type'

export default defineEventHandler(async (event) => {

    const order = await readBody(event)

    let info = await getInfo(order)
    return info
})

const getInfo = async ({stock, type, id}) => {

    let data = await getData({type, id, stock})
    if (!data) return null

    Object.assign(data, {
        id: String(id),
        stock: stock.toUpperCase()
    })

    return data
}

const getData = async ({type, id, stock}) => {

    let browser

    try {
        let url = ''
        browser = await puppeteer.launch({headless: 'new', defaultViewport: null})

        switch (type) {
            case 'IMAGE':
                url = `https://www.istockphoto.com/search/2/image?family=creative&phrase=${id}`
                break
            case 'ISTOCK_HD':
            case 'ISTOCK_4K':
                url = `https://www.istockphoto.com/search/2/film?family=creative&phrase=${id}`
                break
        }

        const json = await getJsonIstock({url, browser})

        switch (type) {
            case 'IMAGE':
                return getDataIstockImage({json})
            case 'ISTOCK_HD':
                return getDataIstockHd({json})
            case 'ISTOCK_4K':
                return getDataIstock4k({json})
        }

    } catch (e) {
        console.log(`error when getting a real link by id ${id} ${stock} ${type}`, e)
        return false
    } finally {
        await browser.close()
    }
}


const getJsonIstock = async ({url, browser, cnt = 0}) => {

    const page = await browser.newPage()
    await page.goto(url, {waitUntil: "domcontentloaded"})

    try {
        await page.waitForSelector("[data-component='AssetDetail']", {
            timeout: 15000
        })
    } catch (e) {
        if (cnt < 3) {
            cnt++
            page.close()
            return await getJsonIstock({url, browser, cnt})
        } else {
            throw Error("doesn't open the page")
        }
    }

    const data = await page.evaluate(() => {
        return document.querySelector("[data-component='AssetDetail']").innerText
    })

    const json = JSON.parse(data).asset
    return json
}

const getFormatAndSizeIstock = (json) => {
    let format = '', size = ''
    format = json.imageSizes.at(-1).contentType.toUpperCase()
    if (format != 'EPS') size = `${json.actualMaxDimensions.width}x${json.actualMaxDimensions.height}`
    if (format == 'JPEG') format = 'JPG'
    return {format, size}
}

const getDataIstockImage = ({json}) => {

    let {format, size} = getFormatAndSizeIstock(json)

    let fileData = {
        preview: json.compUrl,
        size,
        format,
        type: fileType.IMAGE
    }

    return fileData
}

const getDataIstockHd = ({json, changeType = false}) => {
    let {format, size} = getFormatAndSizeIstock(json)

    let fileData = {
        preview: json.compUrl,
        size,
        format,
        type: fileType.ISTOCK_HD,
        changeType
    }

    let is4k = availability4k(json.imageSizes)
    if (is4k) {
        let sizeHD = hdInstead4k(json.imageSizes)
        if (!sizeHD) return false
        Object.assign(fileData, {size: sizeHD})
    }

    return fileData
}

const getDataIstock4k = ({json}) => {

    let {format, size} = getFormatAndSizeIstock(json)

    let fileData = {
        preview: json.compUrl,
        size,
        format,
        type: fileType.ISTOCK_4K
    }

    let is4k = availability4k(json.imageSizes)
    if (!is4k) return getDataIstockHd({json, changeType: true})

    return fileData
}

const availability4k = (sizes) => {
    for (let size in sizes) {
        if (sizes[size].definition == '4K') return true
    }
    return false
}

const hdInstead4k = (sizes) => {
    for (let size in sizes) {
        if (sizes[size].definition == 'HD') {
            let pixels = sizes[size].pixels.split(' ')
            return `${pixels[0]}x${pixels[2]}`
        }
    }
}