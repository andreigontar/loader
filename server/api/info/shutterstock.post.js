import axios from 'axios'
import {JSDOM} from 'jsdom'
import fileType from '@/server/data/file-type'

export default defineEventHandler(async (event) => {

    const order = await readBody(event)

    return await getInfo(order)
})

const getInfo = async ({stock, type, id}) => {

    let realLink = await getLink({type, id, stock})
    if (!realLink) return false

    try {
        const {data} = await axios.get(realLink)

        const {document} = (new JSDOM(data)).window
        const json = JSON.parse(document.getElementById('__NEXT_DATA__').innerHTML)
        const asset = json.props.pageProps.asset

        switch (type) {
            case 'SHUTTERSTOCK_AUDIO':
                return getDataShAudio({id, stock})
            case 'IMAGE':
                return getDataShImage({asset, stock})
            default:
                return getDataShVideo({asset, type, stock})
        }

    } catch (e) {
        console.log(`error when parsing in getInfo() - id ${id} ${type} ${stock}`, e)
        return false
    }
}

const getLink = async ({type, id, stock}) => {
    let searchLink = ''

    switch (type) {
        case 'IMAGE':
            searchLink = `https://www.shutterstock.com/_next/data/eEDxY-v4L2nWC0If00kcP/en/_shutterstock/search/${id}.json?term=${id}`
            break;

        case 'SHUTTERSTOCK_HD':
        case 'SHUTTERSTOCK_HD_SELECT':
        case 'SHUTTERSTOCK_4K':
        case 'SHUTTERSTOCK_4K_SELECT':
            searchLink = `https://www.shutterstock.com/_next/data/eEDxY-v4L2nWC0If00kcP/en/_shutterstock/video/search/${id}.json?term=${id}`
            break;

        case 'SHUTTERSTOCK_AUDIO':
            searchLink = `https://www.shutterstock.com/_next/data/eEDxY-v4L2nWC0If00kcP/en/_shutterstock/music/search/${id}.json?term=${id}`
            break;
    }

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: searchLink,
        headers: {
            'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
            'x-nextjs-data': '1',
            'tracestate': '967232@nr=0-1-967232-1588632792-089c3bf48714d2e5----1679654484821',
            'traceparent': '00-d15dcf85ab4c3866d2e33f791cd63bb0-089c3bf48714d2e5-01',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            'newrelic': 'eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6Ijk2NzIzMiIsImFwIjoiMTU4ODYzMjc5MiIsImlkIjoiMDg5YzNiZjQ4NzE0ZDJlNSIsInRyIjoiZDE1ZGNmODVhYjRjMzg2NmQyZTMzZjc5MWNkNjNiYjAiLCJ0aSI6MTY3OTY1NDQ4NDgyMX19',
            'sec-ch-ua-platform': '"Windows"',
            'Accept': '*/*',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Cookie': 'n_v=2d084c25142; ssnext=true'
        }
    }

    try {
        const response = await axios.request(config)
        if (!response.data.pageProps.__N_REDIRECT) {
            console.log(`invalid image id = ${id} in getLink() ${stock} ${type}`)
            return false
        }
        return 'https://www.shutterstock.com/' + response.data.pageProps.__N_REDIRECT
    } catch (e) {
        // TODO может axios отдать ошибку, тогда надо перезапускать
        console.log(`error when getting a real link by id ${id} ${stock} ${type}`)
        return false
    }
}


const getDataShAudio = ({id, stock}) => {
    return {
        id: String(id),
        preview: null,
        type: fileType.SHUTTERSTOCK_AUDIO,
        format: 'WAV',
        size: null,
        stock: stock.toUpperCase()
    }
}

const getDataShImage = ({asset, stock}) => {

    const imageFormat = {
        JPG: 'JPG',
        EPS: 'EPS',
    }

    let {id, src} = asset
    const sizes = Object.values(asset.sizes)
    let format = sizes[0].format.toUpperCase()
    let size = null

    if (format == imageFormat.JPG) {
        const {width, height} = sizes[sizes.length - 1]
        size = `${width}x${height}`
    }

    return {
        id: String(id),
        preview: src,
        type: fileType.IMAGE,
        format,
        size,
        stock: stock.toUpperCase()
    }
}

const getDataShVideo = ({asset, type, stock}) => {

    const {id, previewImageUrl, isFootageSelect, sizes} = asset

    let objectFile = {
        id: String(id),
        preview: previewImageUrl,
        type: null,
        format: null,
        size: null,
        stock: stock.toUpperCase()
    }

    let videoSize = getDataVideoSize({type, sizes})
    if (videoSize) {
        Object.assign(objectFile, videoSize)
    } else {
        return false
    }

    setShRealTypeVideo({isFootageSelect, objectFile})

    return objectFile
}


const setShRealTypeVideo = ({isFootageSelect, objectFile}) => {
    let objectType = objectFile.type,
        realType = '',
        arrChunk = objectType.split('_'),
        selectIndex = objectType.indexOf('SELECT')

    if (isFootageSelect && selectIndex == -1) {
        switch (arrChunk[1]) {
            case 'HD':
                realType = 'SHUTTERSTOCK_HD_SELECT'
                break
            case '4K':
                realType = 'SHUTTERSTOCK_4K_SELECT'
                break
        }
    } else if (!isFootageSelect && selectIndex != -1) {
        switch (arrChunk[1]) {
            case 'HD':
                realType = 'SHUTTERSTOCK_HD'
                break
            case '4K':
                realType = 'SHUTTERSTOCK_4K'
                break
        }
    }

    if (realType) Object.assign(objectFile, {type: realType, changeType: true})
}

const getDataVideoSize = ({type, sizes}) => {
    const resolution = getShResolutionVideo({type, sizes})
    if (!resolution) return resolution
    return {
        format: resolution.format.toUpperCase(),
        size: `${resolution.width}x${resolution.height}`,
        type: resolution.type,
        changeType: resolution.changeType,
    }
}

const getShResolutionVideo = ({type, sizes}) => {
    const table = {
        'SHUTTERSTOCK_HD': 'hd',
        'SHUTTERSTOCK_HD_SELECT': 'hd',
        'SHUTTERSTOCK_4K': '4k',
        'SHUTTERSTOCK_4K_SELECT': '4k'
    }

    let resolution = {},
        hdResolution = null

    for (let size in sizes) {
        if (sizes[size].resolution == 'hd') hdResolution = sizes[size]
        if (sizes[size].resolution == table[type]) {
            Object.assign(resolution, sizes[size], {type: fileType[type]})
            return resolution
        }
    }

    Object.assign(hdResolution, {type: 'SHUTTERSTOCK_HD', changeType: true})

    return hdResolution ?? false
}