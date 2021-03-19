function extractWordPattern(items) {
  const uniqueProductNames = uniqueNames(items);

  const steppedTwoWordPattern = steppedDoubleWordPattern(uniqueProductNames);

  const first2WordPattern = firstTwoWordPattern(uniqueProductNames);

  const removedublicate = removeDoublicateFromPatterns(
    steppedTwoWordPattern,
    first2WordPattern
  );

  return removedublicate;
}
module.exports = {
  extractWordPattern
};

function uniqueNames(items) {
  return items
    .map(f => f.productName)
    .sort()
    .filter((v, i, names) => names.indexOf(v) === i);
}

function steppedDoubleWordPattern(uniqueNames) {
  const doubleWordMatch = [];
  const productNameWords = uniqueNames.join(' ');

  uniqueNames.map(w => {
    const arrayfy = w.split(' ');
    arrayfy.forEach((element, i, array) => {
      const firstWord = element;
      const secondWord = array[i + 1];
      const secondWordoccurrenceRegex = new RegExp(secondWord, 'g');
      const secondWordOccurrenceCount = productNameWords.match(
        secondWordoccurrenceRegex
      );
      if (
        Math.round(
          secondWordOccurrenceCount.length * uniqueNames.length / 100
        ) < 50
      ) {
        const pattern = `${firstWord} ${secondWord}`;
        const regex = new RegExp(pattern, 'g');
        const count = productNameWords.match(regex);
        const maxPercentage =
          count && Math.round(count.length * uniqueNames.length / 100);

        if (count && maxPercentage > 4 && maxPercentage < 30) {
          doubleWordMatch.push({ sw: pattern, count: count.length });
        }
      }
    });
  });
  const removeDublicateWords = doubleWordMatch.reduce((acc, curr, i) => {
    if (i === 0) {
      return [curr];
    }
    if (acc.findIndex(e => e.sw === curr.sw) === -1) {
      return [...acc, curr];
    }

    return acc;
  }, []);

  return removeDublicateWords;
}

function firstTwoWordPattern(uniqueNames) {
  const doubleWordMatch = [];
  const productNameWords = uniqueNames.join(' ');

  uniqueNames.map(w => {
    const arrayfy = w.split(' ');

    const firstWord = arrayfy[0];
    const secondWord = arrayfy[1];
    const pattern = `${firstWord} ${secondWord}`;
    const regex = new RegExp(pattern, 'g');
    const count = productNameWords.match(regex);
    const maxPercentage =
      count && Math.round(count.length * uniqueNames.length / 100);

    if (count && maxPercentage >= 2 && maxPercentage < 30) {
      doubleWordMatch.push({ sw: pattern, count: count.length });
    }
  });
  const removeDublicateWords = doubleWordMatch.reduce((acc, curr, i) => {
    if (i === 0) {
      return [curr];
    }
    if (acc.findIndex(e => e.sw === curr.sw) === -1) {
      return [...acc, curr];
    }

    return acc;
  }, []);

  return removeDublicateWords;
}

function removeDoublicateFromPatterns(itemsOne, itemsTwo) {
  return [...itemsOne, ...itemsTwo]
    .reduce((acc, curr, i) => {
      if (i === 0) {
        return [curr];
      }
      if (acc.findIndex(e => e.sw === curr.sw) === -1) {
        return [...acc, curr];
      }

      return acc;
    }, [])
    .sort(function(a, b) {
      var textA = a.sw.toUpperCase();
      var textB = b.sw.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
}
