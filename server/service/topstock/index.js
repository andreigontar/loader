import {socketDownload} from "~/server/utils/socket.io";
import qs from "querystring";
import axios from "axios";
import client from "~/server/prisma";
import {TableRequest} from "~/server/service/topstock/utils/topstock";
import got from "got";
import {fileTypeStream} from "file-type";
import * as stream from "stream";
import {promisify} from 'util';
const pipeline = promisify(stream.pipeline)
import path from "path";
import fs from "fs";
import {JSDOM} from "jsdom";
import {Topstock_price} from "~/server/service/topstock/utils/topstock_price";
import {
    createDirectoryOnServer,
    getCountFiles,
    splitFilesIntoPackages,
    packageSourceFiles,
    removeTempFolder,
    dropboxUpload,
    saveFileToStock,
    getExistLink,
    getAccess,
    isAvailableFunds
} from '~/server/order/file-manager';

import {
    removeFromQueue
} from '~/server/order/queue';

export default async ({source, files, queueId, purchaseId}) => {
    const access = await getAccess(source)
    if (!access) return false

    try {
        let isFunds = await isAvailableFunds(files, access)
        if (!isFunds) return false // TODO тут вернуть объект (с инфо что сервис временно недоступен)


        let isCreated = await createDirectoryOnServer(purchaseId, files)
        if (!isCreated) return false

        let allPackSource = {}

        let cntFiles = getCountFiles(files)

        if (cntFiles > 10) {
            files = splitFilesIntoPackages(files, 10)
        } else {
            files = [files]
        }

        for (let item in files) {
            let pack = files[item]

            const preview = await preview(pack, access)

            // TODO рефактор кода
            if (preview.result) {
                const cart = await setToCart(preview.files, access) // todo проверка на isPreview
                const buy = await buy(cart.files, access) // todo проверка на inCart

                const check = await check(buy.files, access)
                if (check.result) {
                    allPackSource = await packageSourceFiles(allPackSource, check.files)
                }
            } else {
                let cookie = await auth(access)
                access.cookie = cookie.data

                if (cookie.result) {
                    const preview = await preview(pack, access)
                    const cart = await setToCart(preview.files, access)
                    const buy = await buy(cart.files, access)
                    const check = await check(buy.files, access)
                    if (check.result) {
                        allPackSource = await packageSourceFiles(allPackSource, check.files)
                    }
                } else {
                    // todo непосредственно эту часть прогнать 5 раз с интервалом
                }
            }
        }

        await removeFromQueue(queueId)
        await removeTempFolder(files, purchaseId)
        await setBalanceIntoDB(files, access) // TODO перенести в check
        socketDownload.emit('finalFiles')
        console.log('---------------final---------------')
        return allPackSource
    } catch (e) {
        console.log('topstock process', e)
        return false
    }
}

const auth = async ({name, login, pass, url}) => {
    try {
        let authData = qs.stringify({
            'action': 'user_login',
            'ajax': '1',
            'user_login': login,
            'user_password': pass
        })

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url,
            headers: {
                'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
            },
            data : authData
        }

        const {status, headers, data} = await axios.request(config)

        if (status == 200 && data == 'Core.result = true;') {
            return {result: true, data: await getCookie(headers['set-cookie'])}
        }
        return {result: false}
    } catch (e) {
        throw new Error("auth topstock")
    }

    async function getCookie(cookie) {
        let arrCookie = []

        cookie.forEach(item => {
            if (item.indexOf('PHPSESSID') != -1 || item.indexOf('wordpress_logged_in') != -1) {
                arrCookie.push(item.split(';')[0])
            }
        })

        if (arrCookie.length) {
            let newCookie = arrCookie.join('; ')

            try {
                await client.source.updateMany({
                    where: {
                        name,
                        login
                    },
                    data: {
                        cookie: newCookie
                    }
                })

                return newCookie
            } catch (e) {
                console.log(e, 'topstock getCookie')
                return false
            }
        } else {
            return false
        }
    }
}

const preview = async (files, {cookie, url}) => {

    for (let stock in files) {
        for (let type in files[stock]) {

            let typeName = files[stock][type]

            for (let i = 0; i < typeName.length; i++) {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `${url}/ajax/preview/${TableRequest[stock][type]}/${typeName[i].id}`,
                    headers: {
                        'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                        'Accept': '*/*',
                        'X-Requested-With': 'XMLHttpRequest',
                        'sec-ch-ua-mobile': '?0',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                        'sec-ch-ua-platform': '"Windows"',
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Dest': 'empty',
                        'Cookie': cookie
                    }
                }

                const {status, data} = await axios.request(config)

                if (status == 200 && data.name) {
                    files[stock][type][i].isPreview = true
                    console.log(`preview ${typeName[i].id}`)
                } else if (status == 200 && !data) {
                    return {result: false, msg: 'required reAuth on topstock'}
                } else {
                    throw new Error('preview status not 200');
                }
            }

        }
    }
    return {result: true, files}
}

const setToCart = async (files, {cookie, url}) => {

    for (let stock in files) {
        for (let type in files[stock]) {

            let ids = {
                'action': 'buy_to_cart',
                'ajax': '1',
                'ids[]': [],
                'stock': TableRequest[stock][type]
            }

            let arrIds = files[stock][type]

            arrIds.forEach(item => {
                if (!item.hasAlready) {
                    // item.isReady = true
                    ids['ids[]'].push(item.id)
                } else {
                    // ids['ids[]'].push(item.id)
                }
            })

            let dataIds = qs.stringify(ids)

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url,
                headers: {
                    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'sec-ch-ua-mobile': '?0',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                    'sec-ch-ua-platform': '"Windows"',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Cookie': cookie
                },
                data: dataIds
            }

            try {
                const {status, data} = await axios.request(config)

                if (status == 200 && data.result == false) {
                    return {result: false, msg: 'required reAuth on topstock'}
                } else if (status != 200) {
                    return {result: false, msg: 'status is different from 200'}
                } else {
                    arrIds.forEach(item => {
                        if (!item.hasAlready) item.inCart = true // TODO по этому полю проверять можно ли скачивать
                    })
                }
            } catch (e) {
                throw new Error(`setToCart topstock ${e}`);
            }

        }
    }

    return {result: true, files}
}

const buy = async (files, {cookie, url}) => {
    let dataInit = qs.stringify({
        'action': 'buy_init',
        'ajax': '1'
    })

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url,
        headers: {
            'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            'sec-ch-ua-platform': '"Windows"',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Cookie': cookie
        },
        data: dataInit
    }

    const {status, data} = await axios.request(config)

    try {
        if (status == 200 && data.result == false) {
            return {result: false, msg: 'required reAuth on topstock'}
        } else if (status != 200) {
            return {result: false, msg: 'status is different from 200'}
        } else {
            return {result: true, files}
        }
    } catch (e) {
        throw new Error(`${e} topstock buy`)
    }
}

const check = (files, {cookie, url}) => {

    return new Promise((resolve, reject) => {
        let timeout = setTimeout(async function tick() {
            let checkFiles = await checkFile(files, cookie, url)
            let isAllReady = await checkAllReady(checkFiles)
            if (isAllReady) {
                clearTimeout(timeout)
                console.log('---------------iter---------------')
                resolve({result: true, files: checkFiles})
            } else {
                timeout = setTimeout(tick, 6000);
            }
        }, 12000)
    })

}

const checkFile = async (files, cookie, url) => {

    for (let stock in files) {
        for (let type in files[stock]) {
            let typeName = files[stock][type]

            for (let i = 0; i < typeName.length; i++) {

                if (typeName[i].inCloud) continue;

                if (!typeName[i].hasAlready) {
                    let dataCheck = qs.stringify({
                        'action': 'buy_check',
                        'ajax': '1',
                        'id': typeName[i].id
                    })

                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url,
                        headers: {
                            'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                            'Accept': '*/*',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest',
                            'sec-ch-ua-mobile': '?0',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                            'sec-ch-ua-platform': '"Windows"',
                            'Sec-Fetch-Site': 'same-origin',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Dest': 'empty',
                            'Cookie': cookie
                        },
                        data: dataCheck
                    }

                    const {status, data} = await axios.request(config)

                    if (data.result && data.status == 2) { // {"result":true,"status":2}
                        typeName[i].isDownloaded = await download(
                            {cookie, url, stock, type, id: typeName[i].id, format: typeName[i].format.toLowerCase(), purchaseId: String(typeName[i].purchaseId)}
                        )
                        let link = await dropboxUpload({stock, type, id: typeName[i].id, format: typeName[i].format.toLowerCase(), purchaseId: String(typeName[i].purchaseId)})
                        if (link) {
                            typeName[i].inCloud = true
                        }
                        await saveFileToStock({stock, type, id: typeName[i].id, format: typeName[i].format, link, size: typeName[i].size, preview: typeName[i].preview, idDownload: typeName[i].idDownload})
                        socketDownload.emit('fileIsReady', {stock, type, id: typeName[i].id, link})
                    } else if (status != 200) {
                        throw new Error('checkFile status != 200')
                    }
                } else {
                    console.log('ready', typeName[i].id)

                    let link = await getExistLink({stock, type, id: typeName[i].id, idDownload: typeName[i].idDownload})
                    if (link) {
                        typeName[i].inCloud = true
                    }
                    socketDownload.emit('fileIsReady', {stock, type, id: typeName[i].id, link})
                }
            }
        }
    }

    return files
}

const checkAllReady = async (files) => {
    console.log('----checkAllReady')
    for (let stock in files) {
        for (let type in files[stock]) {
            let typeName = files[stock][type]

            for (let i = 0; i < typeName.length; i++) {
                if (!typeName[i].inCloud) return false
            }
        }
    }

    return true
}

const download = async ({cookie, url, stock, type, id, format, purchaseId}) => {

    try {
        const downloadStream = await got.stream(`${url}/ajax/download/${id}`, {
            headers: {
                'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Sec-Fetch-Dest': 'document',
                'Cookie': cookie
            }
        })

        downloadStream.on("error", (error) => {console.error(`Download failed ${id}: ${error.message}`)})

        const streamWithFileType = await fileTypeStream(downloadStream)

        // console.log(streamWithFileType.fileType.ext, {format, purchaseId, id})
        let extension = await checkExtension(streamWithFileType.fileType.ext, {format, purchaseId, id})
        let file = path.resolve(process.cwd(), 'purchase', purchaseId, stock, type, `${String(id)}.${extension}`)

        const write = await fs.createWriteStream(file)
        write.on('finish', () => {
            console.log('downloaded', stock, type, id)
        })
        await pipeline(streamWithFileType, write)

        return true

    } catch (e) {
        console.log('topstock download', e)
        return false
    }
}

const checkExtension = async (extension, {format, purchaseId, id}) => {

    if (extension == 'pdf') extension = 'eps'

    if (extension.toLowerCase() != format.toLowerCase()) {
        try {
            await client.download.updateMany({
                where: {
                    purchaseId: parseInt(purchaseId),
                    imageId: id
                },
                data: {
                    fileFormat: extension.toUpperCase()
                }
            })
        } catch (e) {
            console.log(e, `topstock checkExtension ${id}`)
        } finally {
            return extension
        }
    }

    return extension
}

const setBalanceIntoDB = async (files, {cookie, url, name, login}) => {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${url}/prices/`,
        headers: {
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Cookie': cookie
        }
    };

    const {data} = await axios.request(config)
    const {document} = (new JSDOM(data)).window
    let bill = document.querySelector('.pagehead_wrap a[href="/bill"] span').innerHTML
    bill = parseFloat(bill.substring(0, bill.length - 1))

    try {
        await client.source.updateMany({
            where: {
                name,
                login,
            },
            data: {
                balance: bill,
            }
        })
    } catch (e) {
        console.log(`topstock setBalanceIntoDB ${url}`, e)
    }

    return bill
}

const updatePrice = async ({cookie, url, name: source}) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${url}/prices/`,
        headers: {
            'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            'Cookie': cookie
        }
    };

    const {data} = await axios.request(config)
    const {document} = (new JSDOM(data)).window
    let tr = document.querySelectorAll('.priceboxcontent table tbody')[1].querySelectorAll('tr')

    for (let i = 0; i < (tr.length - 1); i++) {
        let name = tr[i].querySelector('td').innerHTML
        let price = tr[i].querySelector('td strong').innerHTML

        if (Topstock_price.hasOwnProperty(name)) {
            try {
                await client.sourcePrice.updateMany({
                    where: {
                        name: source,
                        stockType: Topstock_price[name].stock,
                        fileType: Topstock_price[name].file,
                    },
                    data: {
                        price: parseFloat(price),
                    }
                })
            } catch (e) {
                console.log(`topstock updatePrice ${url}`, e)
                return false
            }
        }
    }

    return true
}