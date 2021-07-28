const makeDir = require('make-dir')
const fs = require('fs')
const path = require('path')

async function saveData({ data, output, filename }) {
    const outputPath = `${process.cwd()}/page-data/${output}/${filename}`
    debugger
    let dataObject = [];
    makeDir.sync(path.dirname(outputPath))
    if (fs.existsSync(outputPath)) {

        const dataFromFile = fs.readFileSync(outputPath, { encoding: 'utf-8' });
        dataObject = JSON.parse(dataFromFile);
        dataObject.push(data);
    } else {
        dataObject.push(data);
    }
    fs.writeFileSync(outputPath, JSON.stringify(dataObject));

}


async function autoScroll(page) {
    await page.evaluate(async () => {

        let last = 0
        await new Promise((resolve, reject) => {

            var scrollingElement = (document.scrollingElement || document.body);
            const timer = setInterval(async () => {
                   // window.focus()
                scrollingElement.scrollTop = scrollingElement.scrollHeight;

                if (scrollingElement.scrollHeight === last) {
                    clearInterval(timer)
                    resolve()
                } else {
                    last = scrollingElement.scrollHeight
                }
            }, 5000);



        });
    });
}

module.exports = { saveData, autoScroll }