const { chromium } = require('C:/Users/Zenbanzakura/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const fs = require('node:fs');
const {pathToFileURL} = require('node:url');
(async () => {
  fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});
  const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const errors=[];
  const page = await browser.newPage({viewport:{width:1440,height:900}});
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
  await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({path:path.join(__dirname,'qa/desktop.png')});
  for (const id of ['statements','products','process','about','contacts']) {
    await page.locator('#'+id).evaluate(el=>el.scrollIntoView());
    await page.waitForTimeout(800);
    await page.screenshot({path:path.join(__dirname,`qa/${id}.png`)});
  }
  const links = await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')));
  for(const href of links) {
    if (/^(mailto:|tel:|https?:)/.test(href)) continue;
    if (href.startsWith('#')) {
      if (!await page.locator(href).count()) errors.push('Missing anchor '+href);
    } else if (!fs.existsSync(path.join(__dirname,href))) errors.push('Missing file '+href);
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>scrollTo(0,0));
  await page.waitForTimeout(800);
  await page.screenshot({path:path.join(__dirname,'qa/mobile.png')});
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth);
  if (overflow) errors.push('Mobile horizontal overflow: '+ await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.className).join(',')));
  await page.locator('.home-burger').click();
  if (await page.locator('.home-burger').getAttribute('aria-expanded') !== 'true') errors.push('Menu did not open');
  await page.screenshot({path:path.join(__dirname,'qa/mobile-menu.png')});
  await page.keyboard.press('Escape');
  if (await page.locator('.home-burger').getAttribute('aria-expanded') !== 'false') errors.push('Menu did not close');
  for(const width of [320,768,1024,1920]) {
    await page.setViewportSize({width,height:900});
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) errors.push('Overflow at '+width);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(100);
  if(await page.locator('body').evaluate(el=>el.classList.contains('_motion'))) errors.push('Reduced motion ignored');
  console.log(JSON.stringify({errors,links:links.length,products:await page.locator('.home-flow__item').count(),steps:await page.locator('.home-process__item').count()},null,2));
  await browser.close();
  if(errors.length) process.exitCode=1;
})();
