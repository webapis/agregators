const Apify = require('apify');
async function getProductUrls({ page }) {
  try {
    await page.waitForSelector('.mainmenu-container');
    const mainMenuItems = await page.$$('.mainmenu-item');

    let urls = [];
    for (let mainMenuItem of mainMenuItems) {
      const mainMenu = await mainMenuItem.$eval('a', (el) => {
        return {
          mainMenuTitle: el.innerText.trim(),
          url: el.href,
        };
      });
      const mainMenuItemMenu = await mainMenuItem.$$eval(
        '.mainmenu-item-menu > div',
        (els) =>
          els.map((subcat) => {
            return {
              subMenuTitle: subcat.querySelector('span').textContent.trim(),
              urls: Array.from(subcat.querySelectorAll('a')).map((e) => {
                return { url: e.href, urlTitle: e.textContent.trim() };
              }),
            };
          })
      );

      urls.push({ mainMenu, subMenu: mainMenuItemMenu });
    }
    const dataset = await Apify.openDataset(`pageUrls`);
    await dataset.pushData(urls);
    return urls;
  } catch (error) {
    throw error;
  }
}

module.exports = { getProductUrls };
