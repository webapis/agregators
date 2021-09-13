function replaceUnicode(str) {
  const replaced = str
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/ü/g, 'u')
    .replace(/i̇/g, 'i')
    .replace(/Ş/g, 'S')
    .replace(/Ö/g, 'O')
    .replace(/Ç/g, 'C')
    .replace(/İ/g, 'I')
    .replace(/Ü/g, 'U')
    .replace(/I/g, 'I');

  return replaced;
}

module.exports = {
  replaceUnicode
};
