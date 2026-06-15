const puppeteer = require("puppeteer-core");
const OUT = "C:/Users/abdul/cvify-shots";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
(async () => {
  await new Promise(r => setTimeout(r, parseInt(process.argv[2]||"110000",10)));
  const b = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
  const shots = [
    { n: "v-home", url: "https://www.cvifyai.com/", w: 1920, h: 950, full: false },
    { n: "v-login", url: "https://www.cvifyai.com/login", w: 1280, h: 900, full: false },
  ];
  for (const s of shots) {
    const p = await b.newPage();
    await p.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });
    try {
      await p.goto(s.url, { waitUntil: "networkidle2", timeout: 60000 });
      await new Promise(r => setTimeout(r, 1500));
      await p.screenshot({ path: `${OUT}/${s.n}.png`, fullPage: s.full });
      console.log("ok", s.n, p.url());
    } catch (e) { console.log("ERR", s.n, e.message); }
    await p.close();
  }
  await b.close();
})();
