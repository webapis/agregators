async function pageUrlsGetter({ page }) {
  let nextPageUrls = [];

  const productCount = await page.$eval(
    '.product-count',
    el => el.textContent.trim().match(/\d+/g)[0]
  );
  const pageUrl = await page.url();

  if (parseInt(productCount) > 72) {
    const pageCount = Math.round(parseInt(productCount) / 72);

    let i;
    for (i = 2; i <= pageCount; i++) {
      nextPageUrls.push(`${pageUrl}?lt=v2&page=${i}`);
    }
  }
  return nextPageUrls;
}

module.exports = {
  pageUrlsGetter
};
