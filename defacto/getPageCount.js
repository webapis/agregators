async function getPageCount({ page }) {
  try {
    const pageUrl = await page.$eval(
      '#pagination > div > a.page-link.next',
      (el) => el.href
    );
    const pageCount = pageUrl.substring(pageUrl.lastIndexOf('=') + 1);

    return parseInt(pageCount);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getPageCount,
};
