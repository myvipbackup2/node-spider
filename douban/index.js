const axios = require('axios');
const cheerio = require('cheerio');
const jieba = require('nodejieba');

async function fetchSingleDoubanList(start) {

    let res = await axios.get(`https://www.douban.com/group/shanghaizufang/`);
    let htmlText = res.data;

}