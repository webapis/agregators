const fs = require('fs');
const { replaceUnicode } = require(`${process.cwd()}/utils/replaceUnicode`);
const makeDir = require('make-dir');
const { splitIntoCategory } = require('./split-into-category');

async function metaCreator({ input, output, output2 }) {
  try {
    const pageData = require(input);
    await makeDir(output);
    await makeDir(output2);
    const data = await splitIntoCategory(pageData);
    const removeUnicode = data.map(d => {
      return {
        ...d,
        category: replaceUnicode(d.category.toLowerCase().replace(/\s/g, ''))
      };
    });

    await Promise.all(
      removeUnicode.map(async d => {
        const outputFolder = `${output}/${d.category}`;
        const outputFolder2 = `${output2}/${d.category}`;
        await makeDir(outputFolder);
        await makeDir(outputFolder2);
        if (d.items.length < 100) {
          fs.writeFileSync(`${outputFolder}/0.json`, JSON.stringify(d));
          fs.writeFileSync(`${outputFolder2}/0.json`, JSON.stringify(d));
          debugger;
        } else {
          let i = 0;
          let p = 0;
          while (i < d.items.length) {
            debugger;
            const items = d.items.slice(i, i + 100);
            debugger;
            fs.writeFileSync(
              `${outputFolder}/${p}.json`,
              JSON.stringify({ ...d, items })
            );
            fs.writeFileSync(
              `${outputFolder2}/${p}.json`,
              JSON.stringify({ ...d, items })
            );
            i = i + 100;
            p++;
            debugger;
          }
        }
        debugger;
      })
    );
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  metaCreator
};
