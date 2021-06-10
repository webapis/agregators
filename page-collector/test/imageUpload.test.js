const { uploadImage } = require('../uploadImage');
describe('image upload test', function() {
  it('image is uploaded', async function() {
    this.timeout(20000);
    const path =
      '/Users/personalcomputer/actors/page-image/tr/moda/erkek/giyim/alt-giyim/jean-pantolon/img/original/0KAM43002MD999_G01_zoom1_V02.jpg';

    await uploadImage(path);
    
  });
});
