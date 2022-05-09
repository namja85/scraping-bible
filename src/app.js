const fs = require('fs');
const path = require('path');
const bible = require('./bible');
const utils = require('./utils');

async function createBibleObject() {
  const bibleList = await utils.getBibleList();

  for (const bible of bibleList) {
    const cnMax = await utils.getMaxCnEachBible(bible.vlIndex);
    bible['cnMax'] = cnMax;
  }

  console.log(bibleList);
};

// createBibleObject();

async function createMarkdownfile(bible) {
  for (const { title, vlIndex, cnMax } of bible) {
    for (let i = 1; i <= cnMax; i++) {
      const content = await utils.getContentEachBible(vlIndex, i);
      const fileContent = `---\ntitle: ${title.english}\n---\n\n#${title.korean} (${title.english}) ${i}장\n${content.map((item) => '- ' + item).join('\n')}`;

      const dirPath = path.join(__dirname, '../output');
      const filePath = path.join(dirPath, `${title.english}-${i}.md`);
      console.log(filePath);
      fs.writeFileSync(filePath, fileContent);
    }
  }
}

createMarkdownfile(bible);