import axios from 'axios'
import {JSDOM} from 'jsdom'
import fileType from '@/server/data/file-type'

export default defineEventHandler(async (event) => {

    const order = await readBody(event)

    return await getInfo(order)
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

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://stock.adobe.com/search?k=${id}&search_type=usertyped`,
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
            'Cookie': 'AdobeStock=bac07c1127667374d0d10cbaab5786ae; asui=b07e062cc773577c88842304017a50d4; ffuuid=pS6tZYjcXutG%2B0D8WjGbyw%3D%3D; gabt=498617%3Aemea_bc%3A0%2C488928%3At2e25trialControl%2C498616%3Aplan-v2%3A0%2C497887%3AMSkinny1%2C498615%3AABC_assetlic%3A0%2C39285420958%3A1%2Cchecksum; isVisitorScriptAloneHosted=1; isid=bbc0c866102885bc779e07c987fa07d57c94f211; maxmind_country=SE; mboxDisable=true'
        }
    }


    try {
        const {data} = await axios.request(config)
        const {document} = (new JSDOM(data)).window
        const json = JSON.parse(document.getElementById('image-detail-json').innerHTML)[id]

        switch (type) {
            case 'IMAGE':
                return getDataAdobeImage({json})
            case 'ADOBESTOCK_HD':
                return getDataAdobeHd({json})
            case 'ADOBESTOCK_4K':
                return getDataAdobe4k({json})
        }

        return null

    } catch (e) {
        console.log(`error when getting a real link by id ${id} ${stock} ${type}`)
        return false
    }
}

const availability4k = (formats) => {
    for (let line in formats) {
        if (formats[line].user_facing_detail_panel_license_tab_label == '4K') return true
    }
    return false
}

const hdInstead4k = (formats, dataVideos) => {
    for (let line in formats) {
        if (formats[line].user_facing_detail_panel_license_tab_label == 'HD') {
            for (let video in dataVideos) {
                if (dataVideos[video].asset_label == 'HD') {
                    return `${dataVideos[video].video_width}x${dataVideos[video].video_height}`
                }
            }
        }
    }

    return false
}

const getDataAdobeImage = ({json}) => {
    let fileData = {
        preview: json.thumbnail_url,
        size: null,
        format: json.file_extension.toUpperCase(),
        type: fileType.IMAGE
    }

    if (json.file_extension == 'jpeg') {
        Object.assign(fileData, {
            size: `${json.content_original_width}x${json.content_original_height}`,
            format: 'JPG'
        });
    } else if (json.file_extension == 'ai') {
        Object.assign(fileData, {format: 'EPS'});
    } else {
        return false
    }

    return fileData
}

const getDataAdobeHd = ({json, changeType = false}) => {
    let fileData = {
        preview: json.thumbnail_url,
        format: json.file_extension.toUpperCase(),
        type: fileType.ADOBESTOCK_HD,
        changeType
    }

    let is4k = availability4k(json.license_details)
    if (is4k) {
        let sizeHD = hdInstead4k(json.license_details, json.possible_data_video)
        if (!sizeHD) return false

        Object.assign(fileData, {size: sizeHD})
    } else {
        Object.assign(fileData, {size: `${json.content_original_width}x${json.content_original_height}`});
    }
    return fileData
}

const getDataAdobe4k = ({json}) => {
    let is4k = availability4k(json.license_details)

    if (!is4k) return getDataAdobeHd({json, changeType: true})

    return {
        preview: json.thumbnail_url,
        size: `${json.content_original_width}x${json.content_original_height}`,
        format: json.file_extension.toUpperCase(),
        type: fileType.ADOBESTOCK_4K
    }
}