const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./module/replaceTemplate");

const card = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const overview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const product = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http
  .createServer((req, res) => {
    const myUrl = req.url;
    const urlParsed = url.parse(myUrl, true);
    const { pathname, query } = urlParsed;

    if (pathname === "/card") {
      res.writeHead(200, { "Content-type": "text/html" });
      res.end(card);
    } else if (pathname === "/" || pathname === "/overview") {
      res.writeHead(200, { "Content-type": "text/html" });
      const cardHtml = dataObj.map((e) => replaceTemplate(card, e)).join("");
      //   console.log(cardHtml);
      const output = overview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
      res.end(output);
    } else if (pathname === "/product") {
      res.writeHead(200, { "Content-type": "text/html" });
      const productData = dataObj[query.id];
      const output = replaceTemplate(product, productData);
      res.end(output);
    } else {
      //   res.writeHead(404, { "Content-type": "text/html" });
      //   res.end("Page Not Found!");
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(data);
    }
  })
  .listen(8000, () => {
    console.log("Server is running!");
  });
