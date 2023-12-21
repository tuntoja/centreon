import puppeteer from 'puppeteer';

const parameters = process.argv.splice(2)

const reports = async () => {
  const dashboardId = parameters[0]
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en'
  });

  await page.goto('http://localhost:4000/centreon/login');
  await page.waitForSelector('input[aria-label="Alias"]');

  await page.type('input[aria-label="Alias"]', 'admin');
  await page.type('input[aria-label="Password"]', 'Centreon!2021');
  await page.click('button[aria-label="Connect"]');

  await page.waitForSelector('svg[aria-label="Profile"]');

  await page.goto(
    `http://localhost:4000/centreon/home/dashboards/${dashboardId}`,
  );

  let panels = [];

  await page.on('response', async response => {
    if (response.url().endsWith(`api/latest/configuration/dashboards/${dashboardId}`)) {
      const json = await response.json()
      panels = json.panels
    }
  });

  await page.waitForSelector('h1[aria-label="page header title"]');

  const windowHeight = panels.reduce((acc, panel) => {
    return acc + (panel.layout.height * 64) + 36;
  }, 100)

  await page.setViewport({
    width: 1920,
    height: windowHeight
  })

  if (panels.find(({ name }) => name.endsWith('generictext'))) {
    await page.waitForSelector('div[aria-label="RichTextEditor"]')
  }

  if (panels.find(({ name }) => name.endsWith('graph'))) {
    await page.waitForSelector('div > svg');
    await page.waitForSelector('g.visx-rows');
    await page.waitForSelector('g.visx-columns');
  }

  await page.evaluate(() => { document.querySelector('header').style.display = 'none' });
  await page.evaluate(() => { document.querySelector('div[data-testid="sidebar"]').style.display = 'none' });

  const date = new Date();

  const name = `dashboard-light-${dashboardId}_${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    
  await page.evaluate((dashboardId) => {
    const date = new Date();
    const titleText = `Dashboard ${dashboardId} ${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const title = document.createElement('h2');
    title.innerText = titleText;
    title.style.position = 'absolute';
    title.style.top = '16px'
    title.style.textAlign = 'center'
    title.style.right = '0px',
    title.style.left = '0px'

    document.body.appendChild(title)
  }, dashboardId)

  await page.pdf({
    path: `${name}.pdf`,
    printBackground: true,
    width: 1920,
    height: windowHeight,
  });

  await page.evaluate(() => { document.querySelector('header').style.display = 'block' });
  await page.waitForSelector('[aria-label="Profile"]')
  await page.click('[aria-label="Profile"]')
  await page.click('input[type="checkbox"]')
  await page.click('[aria-label="Profile"]')

  await page.evaluate(() => { 
    document.querySelector('header').style.display = 'none';
    document.querySelector('div[role="tooltip"]').style.display = 'none';
  });

  await page.pdf({
    path: `dashboard-dark.pdf`,
    printBackground: true,
    width: 1920,
    height: windowHeight,
  });

  await browser.close();
};

reports()