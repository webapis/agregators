/* eslint-disable no-useless-catch */
const fs = require('fs');
const path = require('path');
module.exports = async function ({ filepath }) {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), filepath), 'utf8');

    return content;
  } catch (error) {
    throw error;
  }
};
