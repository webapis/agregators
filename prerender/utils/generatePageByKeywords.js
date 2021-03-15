/* eslint-disable no-fallthrough */
function keywordMatch(keywords, productName) {
  keywords.forEach(k => {
    if (k.test(productName)) {
      return true;
    }
  });

  return false;
}

function generatePageByKeywords(datasets) {
  const productCategories = datasets.map(d => {
    const pantolon = [];
    const others = [];
    const tulum = [];
    const elbise = [];
    const ceket = [];
    const gomlek = [];
    const salopet = [];
    const etek = [];
    const bermuda = [];
    const sort = [];

    const prodCats = d.reduce((acc, curr) => {
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
          bermuda.push(curr);
          break;
        case curr.productName.includes('ŞORT'):
          sort.push(curr);
          break;
        default:
          others.push(curr);
      }

      return {
        pantolon,
        tulum,
        elbise,
        ceket,
        gomlek,
        salopet,
        etek,
        bermuda,
        sort,
        others
      };
    }, []);
    debugger;
    const baggy = [];
    const undefinedPantolons = [];
    const fasionFit = [];
    const anna = [];
    const yuksekBel = [];
    const culotte = [];
    const kemerli = [];
    const kikflare = [];
    const mom = [];
    const slim = [];
    const jogger = [];
    const paca = [];
    const yikamaly = [];
    const wideLeg = [];
    const strait = [];
    const rebeca = [];
    const susana = [];
    const boyfriend = [];
    const slowci = [];
    const skinny = [];
    const detaily = [];
    const havuc = [];
    const pantolonCats = prodCats.pantolon.reduce((acc, curr, i, src) => {
     
      switch (true) {
        case curr.productName.includes('BAGGY'):
          baggy.push(curr);
          break;
        case curr.productName.includes('FİT'):
          fasionFit.push(curr);
          break;
        case curr.productName.includes('ANNA'):
          anna.push(curr);
          break;
        case curr.productName.includes('YÜKSEK BELLİ'):
        case curr.productName.includes('YÜKSEK BEL'):
          yuksekBel.push(curr);
        //// eslint-disable-next-line no-fallthrough
        case curr.productName.includes('CULOTTE'):
          culotte.push(curr);
          break;
        case curr.productName.includes('KEMERLİ'):
          kemerli.push(curr);
          break;
        case curr.productName.includes('FLARE'):
          kikflare.push(curr);
          break;
        case curr.productName.includes('MOM'):
          mom.push(curr);
          break;
        case curr.productName.includes('SLİM'):
          slim.push(curr);
          break;
        case curr.productName.includes('JOGGER'):
          jogger.push(curr);
          break;
        case curr.productName.includes('PAÇA'):
          paca.push(curr);
          break;
        case curr.productName.includes('YIKAMALI'):
          yikamaly.push(curr);
          break;
        case curr.productName.includes('WİDE LEG'):
          wideLeg.push(curr);
          break;
        case curr.productName.includes('STRAIGHT'):
        case curr.productName.includes('STRAİGHT'):
          strait.push(curr);
          break;
        case curr.productName.includes('REBECA'):
          rebeca.push(curr);
          break;
        case curr.productName.includes('BOYFRİEND'):
          boyfriend.push(curr);
          break;
        case curr.productName.includes('SUSANA'):
          susana.push(curr);
          break;
        case curr.productName.includes('SLOUCHY'):
          slowci.push(curr);
          break;
        case curr.productName.includes('SKİNNY'):
          skinny.push(curr);
          break;
        case curr.productName.includes('DETAYLI'):
          detaily.push(curr);
          break;
        case curr.productName.includes('HAVUÇ'):
          havuc.push(curr);
          break;
        //HAVUÇ
        default:
          debugger;
          undefinedPantolons.push(curr);
      }
      return {
        baggy,
        others: undefinedPantolons,
        fasionFit,
        anna,
        yuksekBel,
        culotte,
        kemerli,
        kikflare,
        mom,
        jogger,
        paca,
        yikamaly,
        wideLeg,
        strait,
        rebeca,
        boyfriend,
        susana,
        slowci,
        skinny,
        detaily,
        havuc
      };
      debugger;
    }, []);

    debugger;
    return { ...prodCats, pantolon: pantolonCats };
  });

  //const pantolonCategories =productCategories

  debugger;
}

module.exports = {
  generatePageByKeywords
};
