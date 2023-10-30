import {
    availabilityOfFunds,
    dataPackaging,
    getFiles,
    distributionOfSources,
    distributionOfFilesByResources
} from '~/server/order/file-manager';

import {waitingInQueue} from '~/server/order/queue';

import * as stream from "stream";
import {promisify} from 'util';
const pipeline = promisify(stream.pipeline)
export default defineEventHandler(async (event) => {

    const {userId} = await readBody(event)

    const files = await getFiles(userId)

    if (files.length <= 0) return false
    const funds = await availabilityOfFunds(userId, files)
    // TODO вывод ошибки о том что нехватает средств
    if (!funds.isAvailable) return {result: false, balance: false}

    const {queueId, purchaseId} = await waitingInQueue({userId, funds, files}) // TODO &
    // const {queueId, purchaseId} = {queueId: 500, purchaseId: 600} // TODO &

    if (purchaseId === false) return false
    let resFiles = dataPackaging(files, purchaseId)
    resFiles = distributionOfSources(resFiles)

    return await distributionOfFilesByResources({resFiles, queueId, purchaseId})

})