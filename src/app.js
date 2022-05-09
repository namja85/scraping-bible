const fs = require('fs');
const path = require('path');
const bible = require('./bible');
const utils = require('./utils');

async function createBibleObject() {
  const bibleList = await utils.getBibleList();
  const titles = await utils.getBibleTitleEnglish();

  for (const bible of bibleList) {
    const cnMax = await utils.getMaxCnEachBible(bible.vlIndex);
    bible['cnMax'] = cnMax;
    bible.title['english'] = titles[bible.title.korean];
  }

  console.log(bibleList);
};

// createBibleObject();

async function createMarkdownfile(bible) {
  for (const { title, vlIndex, cnMax } of bible) {
    for (let i = 1; i <= cnMax; i++) {
      try {
        const dirPath = path.join(__dirname, '../output');
        const filePath = path.join(dirPath, `${title.english}-${i}.md`);

        if (!fs.existsSync(filePath)) {
          const content = await utils.getContentEachBible(vlIndex, i);
          const fileContent = `---\ntitle: ${title.english}\n---\n\n# ${title.korean} (${title.english}) ${i}장\n${content.map((item) => '- ' + item).join('\n')}`;
          
          fs.writeFileSync(filePath, fileContent);
          await utils.sleepMs(300);

          console.log(filePath, 'created');
        } else {
          console.log(filePath, 'exist');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

createMarkdownfile(bible);