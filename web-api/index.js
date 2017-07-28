/**
 * node 版本 8.2.1
 * 低版本 node 需要 require('async-to-gen/register') 支持async
 */

let fetch = require('node-fetch');  //http库
let cheerio = require('cheerio');  //类似服务器版JQ
let fs = require('fs');  //file system
let path = require('path');
let color = require('colors');

/**
 * 函数式编程思想
 * 获取 Web API 的 name和href
 * @param {object} content DOM
 * @return {Array} 返回所有API的name和href
 */
function parseLinks(content) {
    let $ = cheerio.load(content);

    function getLink(elem) {
        let $elem = $(elem);
        let name = $elem.text();
        let href = $elem.attr('href');
        return {
            name,
            href
        };
    }

    return Array.from($('#wikiArticle .indexListTerm a')).map(getLink);  //api-links {Array}
}

async function fetchAndSaveHTML(url, filename) {
    let response = await fetch(url);
    let writeStream = fs.createWriteStream(filename);
    return new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        response.body.pipe(writeStream);
    })
}

fetchAndSaveHTML('https://developer.mozilla.org/zh-CN/docs/Web/API/ANGLE_instanced_arrays');

async function fetchWebApi(folder) {
    let response = await fetch('https://developer.mozilla.org/zh-CN/docs/Web/API');
    let content = await response.text();
    let links = parseLinks(content);
    let length = links.length;

    let index = 0;
    let stats = [];

    async function handleLink(link) {
        let {name, href} = link;
        let url = `https://developer.mozilla.org${href}`;
        let filename = path.resolve(folder, `${name}.html`);
        try {
            let start = new Date();
            await fetchAndSaveHTML(url, filename);
            let end = new Date();
            index++;
            console.log(`${url} ` + ` ${end - start} ms`.green + `  ${index}/${length}`.blue);
            stats.push({
                status: 'success',
                url,
                filename
            });
        } catch (error) {
            stats.push({
                status: 'fail',
                url,
                filename,
                error: error.message
            })
        }
    }

    let count = 0;
    while (count < length) {
        let subLinks = links.slice(count, count + 50);
        count += subLinks.length;
        await Promise.all(subLinks.map(handleLink))
    }
    fs.writeFileSync('./stats.json', JSON.stringify(stats, null, 2));

}

fetchWebApi('web-api');







