const { workerService } = require('../workerService');
describe('workerService test', () => {
  it('image cropping test', async function() {
    this.timeout(50000);
    debugger;
    const result = await workerService({
      workerData: {
        nextSlice: [
          '/Users/personalcomputer/actors/page-image/tr/moda/kadin/giyim/alt-giyim/jean-etek/img/original/0KAK77000MDFD6_G03_zoom3_V02.jpg'
        ],
        imageWidth: 288,
        index: 1
      },
      script:
        '/Users/personalcomputer/actors/page-collector/image-processes/2-cropImages.js'
    });
  });
  it('image blur test', async function() {
    this.timeout(50000);
    debugger;
    const result = await workerService({
      workerData: {
        nextSlice: [
          '/Users/personalcomputer/actors/page-image-resized/tr/moda/kadin/giyim/alt-giyim/jean-etek/img/288/0KAK77000MDFD6_G03_zoom3_V02.jpg'
        ],
        imageWidth: 288,
        index: 1
      },
      script:
        '/Users/personalcomputer/actors/page-collector/image-processes/3-blurImages.js'
    });
  });
  it('image embed test', async function() {
    this.timeout(50000);
    debugger;
    const result = await workerService({
      workerData: {
        nextSlice: [
          '/Users/personalcomputer/actors/page-data/tr/moda/kadin/giyim/alt-giyim/jean-etek/koton.json'
        ],
        imageWidth: 288,
        index: 1
      },
      script:
        '/Users/personalcomputer/actors/page-collector/image-processes/4-embedImages.js'
    });
  });
});
