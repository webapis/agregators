const { main } = require(`${process.cwd()}/main`)
const { aggregationPlugins } = require(`${process.cwd()}/aggregation-plugins`)
main()
aggregationPlugins()


global.timecounter = 0

const CheckTime = (() => {
  
  return () => {
    global.timecounter++;
    return  global.timecounter;
  };
})();
{
  const refreshId = setInterval(
    () => {
      const properID = CheckTime();
      console.log(properID * 1000);
      //wait 10 minutes
      if ((properID * 1000) >= 60000 * 2) {
          clearInterval(refreshId);
          process.exit(0)
        
      }
    },
    1000
  );
}