const { workerService } = require('../workerService');
describe('workerService test', () => {
  it('image cropping test', async function() {
    this.timeout(50000);
    debugger;
    const result = await workerService({
      workerData: {
        nextSlice: [
          '/Users/personalcomputer/actors/page-image/tr/moda/kadin/giyim/alt-giyim/jean-etek/img/original/0KAK77000MDFD6_G03_zoom3_V02.jpg'
        ]
      }
    });
  });
});
