const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const bible_list_url = () => 'http://www.holybible.or.kr/B_GAE/';
const bible_url = (vlIndex, cnIndex) => `http://www.holybible.or.kr/B_GAE/cgi/bibleftxt.php?VR=GAE&VL=${vlIndex}&CN=${cnIndex}&CV=99`;

async function getHtml(url, decode = 'UTF-8') {
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    return iconv.decode(res.data, decode).toString();
  } catch (error) {
    console.log(error);
  }
}

async function getBibleList() {
  try {
    const bibleList = [];
    const content = await getHtml(bible_list_url(), 'EUC-KR');
    const $ = cheerio.load(content);
    const $list = $('select[name="VL"]').find('option');
    
    $list.each((_, elem) => {
      const title = $(elem).text().trim();
      const vlIndex = parseInt($(elem).attr('value'));
      
      bibleList.push({ title: { korean: title }, vlIndex });
    });
    
    return bibleList;
  } catch (error) {
    console.log(error);
  }
}

async function getBibleTitleEnglish() {
  try {
    const titles = {};
    const content = await getHtml(bible_list_url(), 'EUC-KR');
    const $ = cheerio.load(content);
    const $list = $('.tk3').find('a[href^="B_GAE/cgi/bibleftxt.php"]');
    
    $list.each((_, elem) => {
      const title = $(elem).text().trim();
      const [all, korean, english] = title.match(/([가-힣0-9 ]+)\s\((.*)\)/);
      
      titles[korean] = english;
    });
    
    return titles;
  } catch (error) {
    console.log(error);
  }
}

async function getMaxCnEachBible(vlIndex) {
  try {
    const content = await getHtml(bible_url(vlIndex, 1), 'EUC-KR');
    const $ = cheerio.load(content);
    const $list = $('.tk3').find('a[href^="B_GAE/cgi/bibleftxt.php"]');
    const cnList = [];
    
    $list.each((_, elem) => {
      const number = parseInt($(elem).text());
      if (!Number.isNaN(number)) {
        cnList.push(number);
      }
    });
    
    return cnList.length ? cnList[cnList.length - 1] : 1;
  } catch (error) {
    console.log(error);
  }
}

async function getContentEachBible(vlIndex, cnIndex) {
  try {
    const content = await getHtml(bible_url(vlIndex, cnIndex), 'EUC-KR');
    const $ = cheerio.load(content);
    const $list = $('.tk4br').find('li');
    const contentList = [];
    
    $list.each((_, elem) => {
      contentList.push($(elem).text().trim());
    });
    
    return contentList;
  } catch (error) {
    console.log(error);
  }
}

function sleepMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  bible_list_url,
  bible_url,
  getBibleList,
  getBibleTitleEnglish,
  getMaxCnEachBible,
  getContentEachBible,
  sleepMs
};
