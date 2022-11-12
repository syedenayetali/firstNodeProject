const fs = require("fs");
const http = require("http");
const url = require("url");

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

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, product.organic);
  }
  return output;
};

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
