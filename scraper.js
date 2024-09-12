const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  // Puppeteer tarayıcısını başlat
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // URL ye git
  await page.goto('https://www.trendyol.com/sr?q=Playstation%205&qt=Playstation%205&st=Playstation%205&os=1');

  // İsimleri ve fiyatları aynı listede toplamalıyız
  const products = await page.evaluate(() => {
    // Tüm ürün öğelerini seç
    const productElements = document.querySelectorAll('.prdct-desc-cntnr');
    const priceElements = document.querySelectorAll('.prc-box-dscntd');

    const productList = [];

    // Her bir ürün için isim ve fiyatı al
    productElements.forEach((element, index) => {
      const name = element.innerText;
      const price = priceElements[index] ? priceElements[index].innerText : null;
      productList.push({ name, price });
    });
    
    return productList;
  });

  // Ürün isim ve fiyatlarını csv uzantılı dosyaya kaydeder
  const csvContent = products.map(product => `${product.name},${product.price}`).join('\n');
  const header = 'Name,Price\n';
  //dosyaya kaydeder
  fs.writeFileSync('products.csv', header + csvContent);

  // Tarayıcıyı kapat
  await browser.close();
})();
