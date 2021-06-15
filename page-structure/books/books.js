
function itemDataCollector({ containerElement }) {
debugger;

    return containerElement;

}
 async function pageController({  eventEmitter, page,dataElements,navigationElements }) {
    debugger;
    const elem =navigationElements[0].href
    debugger;
    // interestSelectors.forEach(s => {
    //     const { selector, element } = s
    //     switch (selector) {
    //         case '.image_container a':
    //             const urlForQueueOne = element.baseURI
    //             pageQueue.push(urlForQueueOne)
    //             break;
    //         case '.pager > li.next > a':
    //             const urlForQueue = element.baseURI
    //             pageQueue.push(urlForQueue)
    //             break;
    //         case '#product_description':
    //             itemDataCollector({containerElement: element })
    //             break;
    //         default:
    //             throw 'unknown page...'
    //     }
    // })

}


const pages = [{ startUrl: 'https://books.toscrape.com/', path: '/', pageController, dataSelectors: ['#product_description'], navigationSelectors:['.image_container a', '.pager > li.next > a'] }]

module.exports = {
    pages
}