const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');
function filterMeta({ dataObject, output, output2 }) {
  const filterDirname = makeDir.sync(`${path.dirname(output)}/filter/`);
  const filterDirname2 = makeDir.sync(`${path.dirname(output2)}/filter/`);
  const dataObjectSorted = sortDataObject({ dataObject });

  const dataObjectSplitByProductName = subArraysByProductName({
    dataObject: dataObjectSorted
  });

  const subArrayWithLimitedLength = dataObjectSubArrayLength100({
    dataObject: dataObjectSplitByProductName
  });

  //savetofile
  const dataObjectSplitIntoPages = subArrayObjectToPages({
    dataObjects: subArrayWithLimitedLength
  });

  dataObjectSplitIntoPages.forEach((d, i) => {
    fs.writeFileSync(`${filterDirname}/${i}.json`, JSON.stringify(d));
    fs.writeFileSync(`${filterDirname2}/${i}.json`, JSON.stringify(d));
  });

  //savetofile
  const withFetchRelation = createFetchRelation({
    dataObjects: dataObjectSplitIntoPages
  });
  fs.writeFileSync(
    `${filterDirname}/filter.json`,
    JSON.stringify(withFetchRelation)
  );
  fs.writeFileSync(
    `${filterDirname2}/filter.json`,
    JSON.stringify(withFetchRelation)
  );
}

module.exports = {
  filterMeta
};

function sortDataObject({ dataObject }) {
  return dataObject
    .map(d => {
      return { ...d, pnc: d.productName.replace(/\s/g, '') };
    })
    .sort((a, b) => (a.pnc > b.pnc ? 1 : -1));
}

function subArraysByProductName({ dataObject }) {
  let items = [];
  return dataObject.reduce((acc, curr, i) => {
    if (i === 0) {
      items.push(curr);
      return acc;
    } else if (items.findIndex(a => a.pnc === curr.pnc) !== -1) {
      items.push(curr);
      return acc;
    } else if (items.findIndex(a => a.pnc === curr.pnc) === -1) {
      acc.push(items);
      items = [];
      items.push(curr);
      return acc;
    }
    return acc;
  }, []);
}

function dataObjectSubArrayLength100({ dataObject }) {
  return dataObject.reduce((acc, curr, i) => {
    const current = [...curr];

    const remailder = Math.round(current.length / 100);

    if (i === 0) {
      if (curr.length > 100 && remailder > 0) {
        const totalItems = [];
        let i;
        for (i = 0; i < remailder; i++) {
          if (i === 0) {
            const items = [...curr].splice(0, 100);

            totalItems.push(...items);
            acc.push(items);
          } else {
            const items = [...curr].splice(totalItems.length, 100);

            totalItems.push(...items);
            acc.push(items);
          }
        }
      } else {
        acc.push(curr);
      }
      return acc;
    } else {
      if (curr.length > 100 && remailder > 0) {
        const totalItems = [];
        let i;
        for (i = 0; i < remailder; i++) {
          if (i === 0) {
            const items = [...curr].splice(0, 100);
            totalItems.push(...items);
            acc.push(items);
          } else {
            const items = [...curr].splice(totalItems.length, 100);
            totalItems.push(...items);
            acc.push(items);
          }
        }
      } else {
        acc.push(curr);
      }
      return acc;
    }
  }, []);
}

function subArrayObjectToPages({ dataObjects }) {
  let pageItems = [];
  return dataObjects.reduce((acc, curr, i) => {
    if (i === 0) {
      pageItems.push(...curr);
      return acc;
    } else if (pageItems.length + curr.length <= 100) {
      pageItems.push(...curr);
      return acc;
    } else if (pageItems.length + curr.length > 100) {
      acc.push(pageItems);
      pageItems = [];
      pageItems.push(...curr);
      return acc;
    }
  }, []);
}

function createFetchRelation({ dataObjects }) {
  const removeDublicate = dataObjects.map(d => {
    return d.reduce((acc, curr, i) => {
      if (i === 0) {
        return [curr];
      } else if (acc.findIndex(a => a.pnc === curr.pnc) === -1) {
        return [...acc, curr];
      } else {
        return acc;
      }
    }, []);
  });
  const addKey = removeDublicate.map((r, i) => {
    return r.map(b => {
      return { ...b, key: [i] };
    });
  });

  const joinKeys = addKey.reduce((acc, curr, i) => {
    if (i === 0) {
      return curr;
    } else {
      acc.push(...curr);
      return acc;
    }
  }, []);
  const removeDubKeys = joinKeys.reduce((acc, curr, i) => {
    if (i === 0) {
      return [curr];
    } else {
      const matchObj = acc.find(a => a.pnc === curr.pnc);
      if (matchObj) {
        const index = acc.findIndex(a => a.pnc === curr.pnc);
        acc.splice(index, 1, {
          ...matchObj,
          key: [...matchObj.key, ...curr.key]
        });
        return acc;
      } else {
        acc.push(curr);
        return acc;
      }
    }
  }, []);

  return removeDubKeys;
}
