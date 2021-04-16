const { extractDescription } = require('./extract.description');
const { extractWordPattern } = require('./extract.word.pattern');
//const { replaceUnicode } = require(`${process.cwd()}/utils/replaceUnicode`);
async function splitIntoCategory(datasetItems) {
  debugger;
  const prodCatNames = datasetItems
    .map(d => d.category)
    .reduce((acc, curr, index) => {
      if (index === 0) {
        return [curr];
      } else if (acc.findIndex(a => a === curr) === -1) {
        return [...acc, curr];
      }

      return acc;
    }, [])
    .map(p => {
      return {
        category: p, //: replaceUnicode(p.toLowerCase().replace(/\s/g, '')),
        items: []
      };
    });
  debugger;
  datasetItems.forEach(d => {
    const category = d.category;

    const product = prodCatNames.find(p => p.category === category);
    product.items.push(d);
    product.pageTitle = `Defacto kadin jean ${category.toLowerCase()}`;
  });

  const withPageDescriptions = prodCatNames.map(p => {
    return {
      ...p,
      pageDescription: extractDescription(p.items),
      wordPatterns: extractWordPattern(p.items)
    };
  });
  debugger;
  return withPageDescriptions;
}

module.exports = {
  splitIntoCategory
};

/*
const { extractDescription } = require('./extract.description');
const { extractWordPattern } = require('./extract.word.pattern');
async function splitIntoCategory(datasetItems) {
  const pantolon = [];
  const others = [];
  const tulum = [];
  const elbise = [];
  const ceket = [];
  const gomlek = [];
  const salopet = [];
  const etek = [];
  const sort = [];

  const jeanCategories = datasetItems.reduce((acc, curr, i, src) => {
    switch (true) {
      case curr.productName.includes('PANTOLON'):
      case curr.productName.includes('PANTOLN'):
      case curr.productName.includes('CARMELA'):
        pantolon.push(curr);
        break;
      case curr.productName.includes('TULUM'):
        tulum.push(curr);
        break;
      case curr.productName.includes('ELBİSE'):
        elbise.push(curr);
        break;
      case curr.productName.includes('CEKET'):
        ceket.push(curr);
        break;
      case curr.productName.includes('GÖMLEK'):
        gomlek.push(curr);
        break;
      case curr.productName.includes('SALOPET'):
        salopet.push(curr);
        break;
      case curr.productName.includes('ETEK'):
        etek.push(curr);
        break;
      case curr.productName.includes('BERMUDA'):
      case curr.productName.includes('ŞORT'):
        sort.push(curr);
        break;
      default:
        others.push(curr);
    }

    const jeanCategories = {
      pantolon: {
        items: pantolon,
        pageName: 'defacto-kadin-jean-pantolon',
        pageTitle: 'Defacto kadin jean pantolon'
      },
      tulum: {
        items: tulum,
        pageName: 'defacto-kadin-jean-tulum',
        pageTitle: 'Defacto kadin jean tulum'
      },
      elbise: {
        items: elbise,
        pageName: 'defacto-kadin-jean-elbise',
        pageTitle: 'Defacto kadin jean elbise'
      },
      ceket: {
        items: ceket,
        pageName: 'defacto-kadin-jean-ceket',
        pageTitle: 'Defacto kadin jean ceket'
      },
      gomlek: {
        items: gomlek,
        pageName: 'defacto-kadin-jean-gomlek',
        pageTitle: 'Defacto kadin jean gomlek'
      },
      salopet: {
        items: salopet,
        pageName: 'defacto-kadin-jean-salopet',
        pageTitle: 'Defacto kadin jean salopet'
      },
      etek: {
        items: etek,
        pageName: 'defacto-kadin-jean-etek',
        pageTitle: 'Defacto kadin jean etek'
      },
      sort: {
        items: sort,
        pageName: 'defacto-kadin-jean-sort',
        pageTitle: 'Defacto kadin jean sort'
      },
      jean: {
        items: src,
        pageName: 'defacto-kadin-jean',
        pageTitle: 'Defacto kadin jean'
      },
      others: {
        items: others,
        pageName: 'defacto-kadin-jean-others',
        pageTitle: 'Defacto kadin jean others'
      }
    };

    return jeanCategories;
  }, []);
  
  const withDescription = {
    ...jeanCategories,
    pantolon: {
      ...jeanCategories.pantolon,
      pageDescription: extractDescription(jeanCategories.pantolon.items),
      wordPatterns: extractWordPattern(jeanCategories.pantolon.items)
    },
    tulum: {
      ...jeanCategories.tulum,
      pageDescription: extractDescription(jeanCategories.tulum.items),
      wordPatterns: extractWordPattern(jeanCategories.tulum.items)
    },
    elbise: {
      ...jeanCategories.elbise,
      pageDescription: extractDescription(jeanCategories.elbise.items),
      wordPatterns: extractWordPattern(jeanCategories.elbise.items)
    },
    ceket: {
      ...jeanCategories.ceket,
      pageDescription: extractDescription(jeanCategories.ceket.items),
      wordPatterns: extractWordPattern(jeanCategories.ceket.items)
    },
    gomlek: {
      ...jeanCategories.gomlek,
      pageDescription: extractDescription(jeanCategories.gomlek.items),
      wordPatterns: extractWordPattern(jeanCategories.gomlek.items)
    },
    salopet: {
      ...jeanCategories.salopet,
      pageDescription: extractDescription(jeanCategories.salopet.items),
      wordPatterns: extractWordPattern(jeanCategories.salopet.items)
    },
    etek: {
      ...jeanCategories.etek,
      pageDescription: extractDescription(jeanCategories.etek.items),
      wordPatterns: extractWordPattern(jeanCategories.etek.items)
    },
    sort: {
      ...jeanCategories.sort,
      pageDescription: extractDescription(jeanCategories.sort.items),
      wordPatterns: extractWordPattern(jeanCategories.sort.items)
    },
    jean: {
      ...jeanCategories.jean,
      pageDescription: extractDescription(jeanCategories.jean.items),
      wordPatterns: extractWordPattern(jeanCategories.jean.items)
    }
  };

  return withDescription;
}

module.exports = {
  splitIntoCategory
};

*/
