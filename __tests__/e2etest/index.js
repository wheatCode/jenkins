const puppeteer = require("puppeteer");
const basic = require("../data/basic.json");
const merge = require("easy-pdf-merge");
// window.merge = merge;

let serverOptions = {
    headless: true,
    waitForTimeOut: 1000,
};
let { headless, waitForTimeOut } = serverOptions;

let spanElement, url, code, title, content, browser, page;
const utils = {
    goto: async (where) => {
        await page.goto(where, { waitUntil: "load" });
        await page.waitForTimeout(waitForTimeOut);
    },
    $$: async (element) => {
        await page.waitForSelector(element);
        return await page.$$(element);
    },
    $eval: async (element, event) => {
        await page.waitForSelector(element, {
            visible: true,
        });
        return await page.$eval(
            element,
            (el, event) => {
                switch (event) {
                    case "innerText":
                        return el.innerText;
                    case "src":
                        return el.getAttribute("src");
                }
            },
            event
        );
    },
    $$eval: async (element, num, event) => {
        await page.waitForSelector(element, {
            visible: true,
        });
        return await page.$$eval(
            element,
            (els, num, event) => {
                switch (event) {
                    case "top":
                        return els[num].style.top;
                    case "left":
                        return els[num].style.left;
                }
            },
            num,
            event
        );
    },
    type: async (element, data) => {
        await page.waitForSelector(element, {
            visible: true,
        });
        await page.type(element, data);
        await page.waitForTimeout(waitForTimeOut);
    },
    click: async (element, options) => {
        await page.waitForSelector(element, {
            visible: true,
        });
        await page.click(element, options);
        await page.waitForTimeout(waitForTimeOut);
    },
    press: async (keyCode) => {
        await page.keyboard.press(keyCode);
        await page.waitForTimeout(waitForTimeOut);
    },
    getPDF: async (name, options = {}) => {
        if (headless) {
            await page.pdf({
                path: `./pdf/${name}.pdf`,
                printBackground: true,
                format: "A4",
                margin: {
                    top: "10px",
                    bottom: "10px",
                    right: "10px",
                    left: "10px",
                },
                ...options,
            });
            await page.waitForTimeout(waitForTimeOut);
        }
    },
    getScreenShot: async (name, options = {}) => {
        await page.screenshot({
            path: `./img/${name}`,
            ...options,
        });
    },
};
(async () => {
    browser = await puppeteer.launch({ headless, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({
        width: 1200,
        height: 800,
    });
    page.on("console", (msg) => {
        for (let i = 0; i < msg.args().length; ++i) {
            let text = msg.args()[i];
            console.log(`${i}: ${text}`);
        }
    });
    await page.emulateMediaType("screen");

    await utils.goto("https://monospace.kktix.cc/events.json");
    url = await page.evaluate(() => {
        let url, json;
        json = JSON.parse(document.querySelector("body").innerText);
        json["entry"].forEach((item) => {
            Object.keys(item).forEach((key) => {
                if (key === "title") {
                    if (item[key].includes("0xFE")) {
                        url = item["url"];
                        return;
                    }
                }
            });
        });
        return url;
    });
    await page.waitForTimeout(waitForTimeOut);
    console.log(url);
    await utils.getScreenShot("第一步驟-取得JSON網址.png", { fullPage: true });
    await page.evaluate(() => {
        const title = document.createElement("h1");
        const body = document.querySelector("body");
        title.textContent = "第一步驟";
        title.style.textAlign = "center";
        title.style.color = "red";
        title.style.zIndex = "99999";
        body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第一步驟-取得JSON網址");
    await utils.goto(url);
    spanElement = await utils.$eval(
        "body > div.outer-wrapper > div.content-wrapper > div > div.og-banner > img",
        "src"
    );
    console.log(spanElement);
    code = await page.evaluate(() => {
        let code = document.querySelector(
            "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > pre"
        ).innerText;
        code = code.slice(14, 30);
        return code;
    });
    await page.waitForTimeout(waitForTimeOut);
    console.log(code);
    title = await page.evaluate(() => {
        let title = document.querySelector(
            "body > div.outer-wrapper > div.content-wrapper > div > div.header > div > h1"
        ).innerText;
        return title;
    });
    await page.waitForTimeout(waitForTimeOut);
    console.log(title);
    content = await page.evaluate(() => {
        let content = document.querySelector(
            "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > h2"
        ).innerText;
        content +=
            " " +
            document.querySelector(
                "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > p:nth-child(2)"
            ).innerText;
        content +=
            " " +
            document.querySelector(
                "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > p:nth-child(4)"
            ).innerText;
        content +=
            " " +
            document.querySelector(
                "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > pre"
            ).innerText;
        return content;
    });
    await page.waitForTimeout(waitForTimeOut);
    console.log(content);
    await utils.getScreenShot("第二步驟-登入活動頁面.png", { fullPage: true });
    await page.evaluate(() => {
        const title = document.createElement("h1");
        const body = document.querySelector("body");
        title.textContent = "第二步驟";
        title.style.textAlign = "center";
        title.style.color = "red";
        title.style.zIndex = "99999";
        body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第二步驟-登入活動頁面");
    await utils.goto(
        "https://www.convertstring.com/zh_TW/EncodeDecode/Base64Decode"
    );
    await utils.type("#input", code);
    await utils.click("#submit");
    await page.waitForTimeout(waitForTimeOut);
    code = await page.evaluate(() => {
        let code;
        code = document.querySelector("#output").value;
        return code;
    });
    await page.waitForTimeout(waitForTimeOut);
    console.log(code);
    await utils.getScreenShot("第三步驟-data-code解碼.png", { fullPage: true });
    await page.evaluate(() => {
        const title = document.createElement("h1");
        const body = document.querySelector("body");
        title.textContent = "第三步驟";
        title.style.textAlign = "center";
        title.style.color = "red";
        title.style.zIndex = "99999";
        body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第三步驟-data-code解碼");
    await utils.goto(url);
    await utils.click(
        "body > div.outer-wrapper > div.content-wrapper > div > div.tickets > a"
    );
    await utils.click(
        "#guestModal > div.modal-dialog > div > div.modal-footer > button"
    );
    await utils.click(
        "#ticket_344407 > div > span.ticket-quantity.ng-scope > input"
    );
    await utils.click(
        "#ticket_344407 > div > span.ticket-quantity.ng-scope > button.btn-default.plus"
    );
    await utils.click("#person_agree_terms");
    await utils.getScreenShot("第四步驟-填寫票數.png", { fullPage: true });
    await page.evaluate(() => {
        const title = document.createElement("h1");
        const body = document.querySelector("body");
        title.textContent = "第四步驟";
        title.style.textAlign = "center";
        title.style.color = "red";
        title.style.zIndex = "99999";
        body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第四步驟-填寫票數");

    await utils.click(
        "#registrationsNewApp > div > div:nth-child(5) > div.form-actions.plain.align-center.register-new-next-button-area"
    );
    await utils.click(
        "#guestModal > div.modal-dialog > div > div.modal-footer > button"
    );
    await utils.type(
        "#field_text_701843 > div > div > input",
        basic.basic[0].name
    );
    await utils.type(
        "#field_email_701844 > div > div > input",
        basic.basic[0].eMail
    );
    await utils.type(
        "#field_text_701845 > div > div > input",
        basic.basic[0].cellphone
    );
    await utils.type("#field_text_701846 > div > div > input", code);
    await utils.click("#person_agree_terms");
    await utils.getScreenShot("第五步驟-填寫表單.png", { fullPage: true });
    await page.evaluate(() => {
        const title = document.createElement("h1");
        const body = document.querySelector("body");
        title.textContent = "第五步驟";
        title.id = "five";
        title.style.textAlign = "center";
        title.style.color = "red";
        title.style.zIndex = "99999";
        body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第五步驟-填寫表單");
    await utils.click(
        "#registrations_controller > div:nth-child(4) > div:nth-child(2) > div > div.form-actions.plain.align-center.ng-scope > a"
    );
    await page.waitForSelector(
        "#registrations_controller > div.ng-scope > div.narrow-wrapper.ng-scope > div > div.order-wrapper.ng-scope > div:nth-child(5) > div:nth-child(2) > div > ul > li > div > div > div.sub-block.ng-scope > div.qr-code.ng-scope > img",
        {
            visible: true,
        }
    );
    await page.waitForTimeout(3000);
    await utils.getScreenShot("第六步驟-完成訂單.png", { fullPage: true });
    await utils.getPDF("第六步驟-完成訂單");
    await page.evaluate(() => {
        const title = document.createElement("h1");
        const body = document.querySelector("body");
        title.textContent = "第六步驟";
        title.style.textAlign = "center";
        title.style.color = "red";
        title.style.zIndex = "99999";
        document.getElementById("five").remove();
        body.insertBefore(title, body.childNodes[0]);
    });
    await page.exposeFunction("myFunc", () => {
        merge(
            [
                `${process.cwd()}/pdf/第一步驟-取得JSON網址.pdf`,
                `${process.cwd()}/pdf/第二步驟-登入活動頁面.pdf`
                ,
                `${process.cwd()}/pdf/第三步驟-data-code解碼.pdf`
                ,
                `${process.cwd()}/pdf/第四步驟-填寫票數.pdf`
                ,
                `${process.cwd()}/pdf/第五步驟-填寫表單.pdf`
                ,
                `${process.cwd()}/pdf/第六步驟-完成訂單.pdf`
            ],
            `${process.cwd()}/pdf/流程.pdf`,
            function (err) {
                if (err) {
                    return console.log(err);
                }
            }
        );
    });
    await page.evaluate(() => {
        window.myFunc();
    });
    browser.close();
})();
