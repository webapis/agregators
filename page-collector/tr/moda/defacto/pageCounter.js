function pageCounter() {
  return {
    selector: '#products',
    countPages: async ({ page }) => {
      try {
        const url = page.url();

        const { pageCount, nextPageUrl } = await page.evaluate(function(_url) {
          const productCount = document
            .querySelector('.product-count')
            .textContent.trim()
            .match(/\d+/g)[0];

          const pageCount = Math.round(parseInt(productCount) / 72);

          let nextPageUrl;
          if (pageCount > 0) {
            nextPageUrl = `${_url}?lt=v2&page=`;
            return { pageCount, nextPageUrl };
          } else {
            return { pageCount: 0, nextPageUrl: null, selector: '#products' };
          }
        }, url);

        return { pageCount, nextPageUrl, selector: '#products' };
      } catch (error) {}
    }
  };
}

module.exports = { pageCounter };
