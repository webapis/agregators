const puppeteer = require("puppeteer");
const launchOptions = { timeout:0,
    headless: true,
    // executablePath:
    //   process.env.MACHINE === "mac"
    //     ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    //     : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  
    args: [
      //    "--no-sandbox",
      //    "--disable-setuid-sandbox",
      // `--window-position=1200,0`,
       `--window-size=1200,1250`,
      "--allow-insecure-localhost",
      // "--user-data-dir=/tmp/foo",
      "--ignore-certificate-errors",
      "--unsafely-treat-insecure-origin-as-secure=https://localhost:3000"
    ] //,devtools: true
  };

module.exports.launch = async function() {
    try {
      this.browser = await puppeteer.launch(launchOptions);
 
    } catch (error) {
      throw error;
    }
  };