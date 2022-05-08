const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const bible_list_url = () => 'http://www.holybible.or.kr/B_GAE/';
const bible_url = (vlIndex, cnIndex) => `http://www.holybible.or.kr/B_GAE/cgi/bibleftxt.php?VR=GAE&VL=${vlIndex}&CN=${cnIndex}&CV=99`

async function getHtml(url, decode = 'UTF-8') {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return iconv.decode(res.data, decode).toString();
  } catch (error) {
    console.error(error);
  }
}

async function getBibleList() {
  const bibleList = [];
  const content = await getHtml(bible_list_url(), 'EUC-KR');
  const $ = cheerio.load(content);
  const $list = $('select[name="VL"]').find('option');
  
  $list.each((_, elem) => {
    const title = $(elem).text().trim();
    const vlIndex = $(elem).attr('value');

    bibleList.push({
      title,
      vlIndex
    });
  });

  return bibleList;
}

async function getMaxCnEachBible() {
  
}

(async () => {
  const bibleList = await getBibleList();
  console.log(bibleList);
})();