import path from "path";
import fs from "fs";
import {rimraf} from "rimraf";
import fsp from "node:fs/promises";
import {dropbox} from "~/server/utils/dropbox";
import client from "~/server/prisma";
import {socketDownload} from "~/server/utils/socket.io";
import {TableSource} from "~/server/utils/TableSource";
import topstock from '~/server/service/topstock'
import fotoget from '~/server/service/fotoget'

export const createDirectoryOnServer = async (purchaseId, files) => {
    let folder = path.resolve(process.cwd(), 'purchase', String(purchaseId))

    try {
        if (fs.existsSync(folder)) await rimraf(folder)
        await fs.mkdir(folder, (err) => {
            if (err) throw err
        })

        for (let stock in files) {
            await fs.mkdir(path.resolve(folder, stock), {recursive: true}, (err) => {
                if (err) throw err
            })
            for (let type in files[stock]) {
                await fs.mkdir(path.resolve(folder, stock, type), {recursive: true}, (err) => {
                    if (err) throw err
                })
            }
        }

        return true
    } catch (e) {
        console.log(e, 'ошибка при создании временных директорий')
        return false
    }
}

export const splitFilesIntoPackages = (files, filesInPack) => {

    let filesInPackages = [],
        numFile = 0,
        pack = 0

    for (let stock in files) {
        for (let type in files[stock]) {

            for (let item in files[stock][type]) {
                let file = files[stock][type][item]

                if (numFile == 0) filesInPackages[pack] = {}
                if (!filesInPackages[pack].hasOwnProperty(stock)) {
                    filesInPackages[pack][stock] = {}
                }

                if (!filesInPackages[pack][stock].hasOwnProperty(type)) {
                    filesInPackages[pack][stock][type] = []
                }

                filesInPackages[pack][stock][type].push(file)


                numFile++
                if (numFile == filesInPack) {
                    numFile = 0
                    pack++
                }
            }
        }
    }

    return filesInPackages
}

export const getCountFiles = (files) => {
    let allCnt = 0
    for (let stock in files) {
        for (let type in files[stock]) {
            allCnt += files[stock][type].length
        }
    }
    return allCnt
}

export const packageSourceFiles = async (allPack, files) => {
    for (let stock in files) {
        if (!allPack.hasOwnProperty(stock)) allPack[stock] = {}
        for (let type in files[stock]) {
            if (!allPack[stock].hasOwnProperty(type)) allPack[stock][type] = []
            let arrItems = files[stock][type]
            for (let item in arrItems) {
                allPack[stock][type].push({
                    id: arrItems[item].id,
                    isDone: arrItems[item].isDone,
                })
            }
        }
    }

    return allPack
}

export const distributionOfFilesByResources = async ({resFiles, queueId, purchaseId}) => {

    const filesAllSource = {}
    let temporaryStorage = []

    for (let source in resFiles) {
        switch (source) {
            // TODO &
            case 'TOPSTOCK':
                temporaryStorage.push(await fotoget({source: 'FOTOGET', files: resFiles[source], queueId, purchaseId}))
                temporaryStorage.push(await topstock({source, files: resFiles[source], queueId, purchaseId}))
                break
            case 'FOTOGET':
                temporaryStorage.push(await fotoget({source, files: resFiles[source], queueId, purchaseId}))
                break
        }
    }

    for (let source in temporaryStorage) {
        await packageSourceFiles(filesAllSource, temporaryStorage[source])
    }

    return filesAllSource
}

export const dropboxUpload = async ({stock, type, id, format, purchaseId}) => {
    // todo сделать обработку ошибок
    try {
        let file = path.resolve(process.cwd(), 'purchase', purchaseId, stock, type, `${id}.${format}`)
        // let res = await dropbox.usersGetCurrentAccount()

        let stat = await fsp.stat(file)
        let statMB = stat.size / (1024 * 1000)
        let MB = Math.round(statMB * 100) / 100

        let upload = await dropbox.filesUpload({
            path: `/${stock}/${type}/${id}.${format}`,
            contents: await fs.createReadStream(file)
        })
        console.log(`uploaded ${id}   size = ${MB}`)

        let copy = await dropbox.filesCopyV2({
            from_path: `/${stock}/${type}/${id}.${format}`,
            to_path: `/purchase/${purchaseId}/${stock}/${id}.${format}`,
            autorename: true
        })
        console.log(`copied ${id}`)


        // let link = await dropbox.sharingListSharedLinks({path: '/5555/595676529.jpg'}) // если уже есть
        let link = await dropbox.sharingCreateSharedLinkWithSettings({path: `/${stock}/${type}/${id}.${format}`},
            {
                access: 'viewer',
                audience: 'public',
                requested_visibility: 'public'
            })

        let url = new URL(link.result.url)
        url.searchParams.set('dl', 1)

        let rm = await fsp.rm(path.resolve(process.cwd(), 'purchase', purchaseId, stock, type, `${id}.${format}`))

        return url.toString()

    } catch (e) {
        console.log(e)
        // console.log(e.error.error['.tag'])
        // console.log(e.error.error['.tag'] == 'expired_access_token')
    }
}

export const getExistLink = async ({stock, type, id, idDownload}) => {
    try {
        const {preview, id: stockId} = await client.stock.findFirst({
            where: {
                imageId: id,
                fileType: type,
                stockType: stock
            },
            select: {
                id: true,
                preview: true,
            }
        })

        await client.download.updateMany({
            where: {
                id: idDownload,
                imageId: id,
                stockType: stock,
                fileType: type,
            },
            data: {
                preview: null,
                size: null,
                stockId
            }
        })

        return preview

    } catch (e) {
        console.log(`не найдена ссылка на файл ${stock} ${type} ${id}`)
    }
}

export const removeTempFolder = async (files, purchaseId) => {
    try {
        let rm = await rimraf(path.resolve(process.cwd(), 'purchase', String(purchaseId)))
        if (rm) return true
    } catch (e) {
        console.log(`removeTempFolder, ${e}`)
    }
}

export const saveFileToStock = async ({stock, type, id, format, link, size, preview, idDownload}) => {

    const stockTable = await client.stock.create({
        data: {
            imageId: id,
            fileType: type,
            stockType: stock,
            size,
            fileFormat: format,
            link,
            preview
        }
    })

    let download = await client.download.updateMany({
        where: {
            id: idDownload,
            imageId: id,
            stockType: stock,
            fileType: type,
        },
        data: {
            preview: null,
            size: null,
            stockId: stockTable.id
        }
    })

    return !!download
}

export const availabilityOfFunds = async (userId, files) => {
    let cost = 0

    files.forEach(file => {
        cost += parseInt(file.cost)
    })

    try {
        const {balance, id} = await client.wallet.findFirst({
            where: {
                userId
            },
            select: {
                id: true,
                balance: true,
            }
        })

        if (balance > cost) {
            return {isAvailable: true, walletId: id, cost, balance}
        } else {
            return {isAvailable: false, walletId: id, cost, balance}
        }
    } catch (e) {
        console.log(e, 'не удалось получить кошелёк пользователья')
    }
}

export const setPaymentIntoDB = async (userId, funds) => {
    try {
        const purchase = await client.purchase.create({
            data: {
                walletId: funds.walletId,
                sum: funds.cost
            }
        })

        if (purchase.id) {

            let newBalance = parseInt(funds.balance - funds.cost)

            await client.wallet.update({
                where: {
                    id: funds.walletId
                },
                data: {
                    balance: newBalance
                }
            })

            socketDownload.emit('balanceUpdate', newBalance)

            await client.download.updateMany({
                where: {
                    userId,
                    purchaseId: null
                },
                data: {
                    purchaseId: purchase.id,
                }
            })

            return purchase.id
        } else {
            return false
        }

    } catch (e) {
        console.log(e, 'не создалась запись платежа в базе')
    }
}

export const getFiles = async (userId) => {

    const files = await client.download.findMany({
        where: {
            userId,
            purchaseId: null
        },
        select: {
            id: true,
            purchaseId: true,
            stockType: true,
            fileType: true,
            imageId: true,
            fileFormat: true,
            cost: true,
            size: true,
            preview: true,
            hasAlready: true
        }
    })

    return files
}

export const dataPackaging = (files, purchaseId) => {
    let resFiles = {}

    files.forEach(elem => {
        // todo to simplify
        let obj = {id: elem.imageId, format: elem.fileFormat, size: elem.size, preview: elem.preview, idDownload: elem.id, hasAlready: elem.hasAlready}

        if (!resFiles.hasOwnProperty(elem.stockType)) {
            resFiles[elem.stockType] = {}
            resFiles[elem.stockType][elem.fileType] = [obj]
        } else {
            if (!resFiles[elem.stockType].hasOwnProperty(elem.fileType)) {
                resFiles[elem.stockType][elem.fileType] = [obj]
            } else {
                resFiles[elem.stockType][elem.fileType].push(obj)
            }
        }
    })

    for (let stock in resFiles) {
        for (let type in resFiles[stock]) {
            let items = resFiles[stock][type]
            items.forEach(item => {
                Object.assign(item, {
                    isPreview: false,
                    inCart: false,
                    isDownloaded: false,
                    inCloud: false,
                    purchaseId
                })
            })
        }
    }

    return resFiles
}

export const distributionOfSources = (files) => {
    let distribution = {}

    for (let source in TableSource) {
        for (let stock in TableSource[source]) {

            if (files[stock]) {
                for (let type in TableSource[source][stock]) {
                    let keyType = TableSource[source][stock][type]

                    if (files[stock][keyType]) {
                        if (!distribution.hasOwnProperty(source)) distribution[source] = {}
                        if (!distribution[source].hasOwnProperty(stock)) distribution[source][stock] = {}
                        if (!distribution[source][stock].hasOwnProperty(keyType)) distribution[source][stock][keyType] = {}

                        distribution[source][stock][keyType] = files[stock][keyType]
                    }
                }
            }
        }
    }

    return distribution
}

export const getAccess = async (source) => {
    try {
        const access = await client.source.findFirst({
            where: {
                name: source,
            }
        })

        return access
    } catch (e) {
        console.log(e, 'ошибка при получении данных источника из БД')
        return false
    }
}

export const calculation = async (files, source) => {

    let tablePrice,
        allPrice = 0

    try {
        tablePrice = await client.sourcePrice.findMany({
            where: {
                name: source,
            }
        })
    } catch (e) {
        console.log(`topstock calculation`, e)
    }

    for (let stock in files) {
        for (let type in files[stock]) {
            let cntFiles = files[stock][type].length

            for (let i = 0; i < tablePrice.length; i++) {
                if (tablePrice[i].stockType == stock && tablePrice[i].fileType == type) {
                    allPrice += tablePrice[i].price * cntFiles
                }
            }
        }
    }

    return allPrice
}

export const isAvailableFunds = async (files, {name, balance}) => {

    let finalCost = await calculation(files, name)

    return !!(balance - finalCost)
}




// TODO это оставить для CRON, а сейчас сделать раз в 5 дней
// TODO & придумать куда закинуть (точно туда где есть assets)
// возможно поправить по времени
export const needUpdatePrice = (date) => {
    let dateDB = new Date(Date.parse(date))
    dateDB.setHours(dateDB.getHours() - 3)
    let dateNow = Date.now()

    let diffInMs = Math.abs(dateNow - dateDB)
    let diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    return diffInMinutes >= 1440
}