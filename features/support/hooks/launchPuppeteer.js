
const puppeteer = require("puppeteer");
console.log('process.env.headless.....', (/true/i).test(process.env.headless))
const launchOptions = {
    timeout: 0,
    //slowMo: 15,
    headless: (/true/i).test(process.env.headless),
  
    // executablePath:
    //   process.env.MACHINE === "mac"
    //     ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    //     : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  
    args: [
      //  "--no-sandbox",
      //   "--disable-setuid-sandbox",
      // `--window-position=1200,0`,
      "--disable-web-security",
      `--window-size=1200,1250`,
      "--allow-insecure-localhost",
      //  "--user-data-dir=/tmp/foo",
      "--ignore-certificate-errors",
      "--unsafely-treat-insecure-origin-as-secure=https://localhost:8888"
    ]// ,devtools: true
  };
async function launchPuppeteer(){
    //1. LAUNCH BROWSER
    global.browser = await puppeteer.launch(launchOptions);
}

module.exports={launchPuppeteer}