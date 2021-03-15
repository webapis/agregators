const fs = require('fs');
const makeDir = require('make-dir');
const { extractDescription } = require('./extract.description');
const { extractWordPattern } = require('./extract.word.pattern');
async function splitIntoCategory(datasetItems, gender) {
  debugger;

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
    if (others.length > 0)
      throw 'split-into-category others length should be ===0';
    const jeanCategories = {
      pantolonPage: {
        items: pantolon,
        pageName: 'defacto-kadin-jean-pantolon',
        pageTitle: 'Defacto kadin jean pantolon'
      },
      tulumPage: {
        items: tulum,
        pageName: 'defacto-kadin-jean-tulum',
        pageTitle: 'Defacto kadin jean tulum'
      },
      elbisePage: {
        items: elbise,
        pageName: 'defacto-kadin-jean-elbise',
        pageTitle: 'Defacto kadin jean elbise'
      },
      ceketPage: {
        items: ceket,
        pageName: 'defacto-kadin-jean-ceket',
        pageTitle: 'Defacto kadin jean ceket'
      },
      gomlekPage: {
        items: gomlek,
        pageName: 'defacto-kadin-jean-gomlek',
        pageTitle: 'Defacto kadin jean gomlek'
      },
      salopetPage: {
        items: salopet,
        pageName: 'defacto-kadin-jean-salopet',
        pageTitle: 'Defacto kadin jean salopet'
      },
      etekPage: {
        items: etek,
        pageName: 'defacto-kadin-jean-etek',
        pageTitle: 'Defacto kadin jean etek'
      },
      sortPage: {
        items: sort,
        pageName: 'defacto-kadin-jean-sort',
        pageTitle: 'Defacto kadin jean sort'
      },
      jeanPage: {
        items: src,
        pageName: 'defacto-kadin-jean',
        pageTitle: 'Defacto kadin jean'
      },
      othersPage: {
        items: others,
        pageName: 'defacto-kadin-jean-others',
        pageTitle: 'Defacto kadin jean others'
      }
    };

    return jeanCategories;
  }, []);

  const withDescription = {
    ...jeanCategories,
    pantolonPage: {
      ...jeanCategories.pantolonPage,
      pageDescription: extractDescription(jeanCategories.pantolonPage.items),
      wordPatterns: extractWordPattern(jeanCategories.pantolonPage.items)
    },
    tulumPage: {
      ...jeanCategories.tulumPage,
      pageDescription: extractDescription(jeanCategories.tulumPage.items),
      wordPatterns: extractWordPattern(jeanCategories.tulumPage.items)
    },
    elbisePage: {
      ...jeanCategories.elbisePage,
      pageDescription: extractDescription(jeanCategories.elbisePage.items),
      wordPatterns: extractWordPattern(jeanCategories.elbisePage.items)
    },
    ceketPage: {
      ...jeanCategories.ceketPage,
      pageDescription: extractDescription(jeanCategories.ceketPage.items),
      wordPatterns: extractWordPattern(jeanCategories.ceketPage.items)
    },
    gomlekPage: {
      ...jeanCategories.gomlekPage,
      pageDescription: extractDescription(jeanCategories.gomlekPage.items),
      wordPatterns: extractWordPattern(jeanCategories.gomlekPage.items)
    },
    salopetPage: {
      ...jeanCategories.salopetPage,
      pageDescription: extractDescription(jeanCategories.salopetPage.items),
      wordPatterns: extractWordPattern(jeanCategories.salopetPage.items)
    },
    etekPage: {
      ...jeanCategories.etekPage,
      pageDescription: extractDescription(jeanCategories.etekPage.items),
      wordPatterns: extractWordPattern(jeanCategories.etekPage.items)
    },
    sortPage: {
      ...jeanCategories.sortPage,
      pageDescription: extractDescription(jeanCategories.sortPage.items),
      wordPatterns: extractWordPattern(jeanCategories.sortPage.items)
    },
    jeanPage: {
      ...jeanCategories.jeanPage,
      pageDescription: extractDescription(jeanCategories.jeanPage.items),
      wordPatterns: extractWordPattern(jeanCategories.jeanPage.items)
    }
  };
  for (const cat in withDescription) {
    const current = withDescription[cat];
    const folderPath = await makeDir(
      `${process.cwd()}/aggregation/defacto/jean/${gender}`
    );
    let filePath;
    if (cat === 'jean') {
      filePath = `${folderPath}/${gender}-${cat}.json`;
    } else {
      filePath = `${folderPath}/${gender}-jean-${cat}.json`;
    }

    fs.writeFileSync(filePath, JSON.stringify(current));
  }
  debugger;
  return withDescription;
}

module.exports = {
  splitIntoCategory
};
