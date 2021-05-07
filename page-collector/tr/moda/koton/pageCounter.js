function pageCounter() {
  return {
    selector: '.productGrid',

    countPages: async ({ page }) => {
      try {
        const paginationExists = await page.$('.paging');

        if (paginationExists) {
          const { pageCount, nextPageUrl } = await page.evaluate(function() {
            const pagesCountString = Array.from(
              document.querySelector('.paging').querySelectorAll('li>a')
            ).map(m => m.innerHTML);
            const pageCount = Number.parseInt(
              pagesCountString.find((p, i) => i === pagesCountString.length - 2)
            );

            let nextPageUrl;

            const rawValue =
              `https://www.koton.com` +
              document
                .querySelector('.paging')
                .querySelector('li>a')
                .getAttribute('href');
            nextPageUrl = rawValue.substring(0, rawValue.lastIndexOf('=') + 1);
            return { pageCount, nextPageUrl };
          });
          return { pageCount, nextPageUrl };
        } else {
          return { pageCount: 0, nextPageUrl: null };
        }
      } catch (error) {}
    }
  };
}

module.exports = { pageCounter };
