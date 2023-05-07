const fs = require("fs");
const http = require("http");
const url = require("url");

// SERVER
let port = 8000;

const homePage = fs.readFileSync(`${__dirname}/index.html`, "utf-8");

const componentCard = fs.readFileSync(
    `${__dirname}/components/card.html`,
    "utf-8"
);

const componentProduct = fs.readFileSync(
    `${__dirname}/components/product.html`,
    "utf-8"
);

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const replaceData = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%ORGANIC%}/g, product.organic);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic)
        output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

    return output;
};

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //* Home page
    if (pathname === "/") {
        res.writeHead(200, {
            "Content-type": "text/html",
        });

        const cardsHtml = dataObj
            .map((el) => replaceData(componentCard, el))
            .join("");

        const output = homePage.replace("{%PRODUCT_CARDS%}", cardsHtml);

        res.end(output);

        //* Product page
    } else if (pathname === "/product") {
        res.writeHead(200, {
            "Content-type": "text/html",
        });

        const product = dataObj[query.id];
        const output = replaceData(componentProduct, product);

        res.end(output);
    } else {
        res.writeHead(404, {
            "Content-type": "text/html",
        });
        res.end("<h1>Page not found!</h1>");
    }
});

server.listen(port, "127.0.0.1", () => {
    console.log(`Listening to request on port ${port}`);
});
