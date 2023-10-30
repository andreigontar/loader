import axios from 'axios'
import fileType from '@/server/data/file-type'
import {dropbox} from "~/server/utils/dropbox";
import got from "got";
import fs from "fs";

export default defineEventHandler(async (event) => {

    const order = await readBody(event)

    let info = await getInfo(order)
    return info
})


const getInfo = async ({stock, type, id}) => {

    let data = await getData({type, id, stock})
    if (!data) return false

    Object.assign(data, {
        id: String(id),
        stock: stock.toUpperCase()
    })

    return data
}

const getData = async ({type, id, stock}) => {

    let data = JSON.stringify([
        {
            "query": {
                "dp_command": "saveUserSettingsInternal",
                "dp_user_settings": "{\"History\":{\"owner\":\"\",\"isNewSession\":true,\"viewed\":0,\"stack\":[{\"url\":\"https://depositphotos.com/\",\"route\":\"Index\",\"referrer\":\"https://depositphotos.com/\"}]},\"searchSession\":null}"
            }
        },
        {
            "hash": "h302240390",
            "query": {
                "dp_command": "getMediaDataInternal",
                "dp_media_id": id
            }
        }
    ]);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://depositphotos.com/api',
        headers: {
            'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'X-Stubs': 'null',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            'sec-ch-ua-platform': '"Windows"',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Cookie': '10_lang=en; AMP_TOKEN=%24NOT_FOUND; __utmDP=1041317990.1670250421%7Cutmcsr%3DnotificationBar%7Cutmcmd%3Demail%7Cutmccn%3DNotificationBars_trial23_nologin%7Cutmcct%3Dall%7Citerable_campaign%3D5789804%7Citerable_template%3D7815423%7Cutmctr%3Dbody; __utma=257054494.1041317990.1670250421.1680619618.1680681183.40; __utmb=257054494.2.10.1680681183; __utmc=257054494; __utmt=1; __utmz=257054494.1679672875.30.10.utmcsr=notificationBar|utmccn=NotificationBars_trial23_nologin|utmcmd=email|utmctr=body|utmcct=all; _ga=GA1.2.1041317990.1670250421; _gat_depositphotos=1; _gid=GA1.2.603828722.1680534625; _hjAbsoluteSessionInProgress=1; _hjIncludedInSessionSample_410340=0; _hjSessionUser_410340=eyJpZCI6ImRjMDAzNGI5LTUyYzEtNTVjNy04M2U3LTMxMTAyMjFiM2Y3YiIsImNyZWF0ZWQiOjE2NzAyNTA2NDUyNjYsImV4aXN0aW5nIjp0cnVlfQ==; _hjSession_410340=eyJpZCI6IjFjNjk0MjkzLWU1ODQtNDJkMS05OWJlLTIxMjViODFhNzFkZSIsImNyZWF0ZWQiOjE2ODA2ODExODM3NjYsImluU2FtcGxlIjpmYWxzZX0=; _pin_unauth=dWlkPU9UZzVaakkwT0RJdE5XRXdZaTAwTnpnMUxUZzROV1l0WW1aaVpqSmpOakEyTUdGag; _uetsid=a666f630d23111ed9c157734ce17a2ae; _uetvid=a10775a0763b11eda87b2bb95063b6f3; browserSessionId=7bc7b0f87465cef31197629ca7b92a326fa35d1bbdd350f01fb6cd4618ff3650; dEEn2wbX=but6q7onvtb5180orlpanp0er4; webAppSessionId=s%3AlGGiI-XQb_M7lP400QNVEmeli1FXEDCI.jq1NBSi0xbWttrPzPKsjt078bcmWsg8GvE7b7gmrDjA'
        },
        data : data
    }

    try {
        const response = await axios.request(config)
        let data = response.data.h302240390.result[0],
            format = data.type == 'i' ? 'i' : 'v',
            formatFile = data.type == 'i' ? 'JPG' : 'EPS',
            fileSize = null,
            path = `/${stock}/${type}/preview_${id}.jpg`

        if (formatFile != 'EPS') fileSize = `${data.width}x${data.height}`

        return {
            preview: await getDropboxPreview({data, path, format, id}),
            size: fileSize,
            format: formatFile.toUpperCase(),
            type: fileType.IMAGE,
        }
    } catch (e) {
        console.log(`error when getting a real link by id ${id} ${stock} ${type}`, e)
        return false
    }
}


const getDropboxPreview = async ({data, path, format, id}) => {
    let preview = null, url = '', linkPreview = null, isExist = null

    try {
        isExist = await dropbox.sharingListSharedLinks({path})
        if (isExist.result.links.length) url = isExist.result.links[0].url
    } catch (e) {
        preview = await dropbox.filesUpload({
            path,
            contents: await got.stream(`https://${data.thumbSource}/${data.sellerId}/${format}/950/depositphotos_${id}-${data.filename}.jpg`)
        })

        if (preview) {
            url = (await dropbox.sharingCreateSharedLinkWithSettings({path},
                {
                    access: 'viewer',
                    audience: 'public',
                    requested_visibility: 'public'
                })).result.url
        }
    }

    if (!url) return false

    linkPreview = new URL(url)
    linkPreview.searchParams.set('raw', 1)
    linkPreview.searchParams.delete('dl')

    return linkPreview?.toString() ?? false
}