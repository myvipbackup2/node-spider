/**
 * node 版本 8.2.1
 * 低版本 node 需要 require('async-to-gen/register') 支持async
 */

let axios = require('axios');  //http库
let cheerio = require('cheerio');  //类似服务器版JQ
let fs = require('fs');  //file system
let path = require('path');

/**
 * 函数式编程思想
 * 获取 Web API 的 name和href
 * @param {object} content cheerio对象，DOM节点
 * @return {Array} 返回所有API的name和href
 */
const parseLinks = content => {
    let $ = cheerio.load(content);
    const getLink = elem => {
        let $elem = $(elem);
        let name = $elem.text();
        let href = $elem.attr('href');
        return {
            name,
            href
        };
    };
    return Array.from($('#wikiArticle .indexListTerm a')).map(getLink);  //api-links {Array}
};

async function fetchAndSaveHTML(url, filename) {
    let response = await axios.get(`https://developer.mozilla.org${url}`);

}

fetchAndSaveHTML('/zh-CN/docs/Web/API/AnimationEffectReadOnly');





