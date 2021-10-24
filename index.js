// node index.js --url="https://leetcode.com" --choice=1/2/3
let minimist = require('minimist');
let args = minimist(process.argv);
let puppeteer = require("puppeteer");
let fs = require('fs');
const { fstat } = require('fs');

//Choice 1 => Interview Experiences
//Choice 2 => Compensation
// Choice 3 => Study Guides 
let companies = ["Microsoft","Google","Bloomberg","Amazon"];
let studyterms = ["Dynamic Programming","Graphs","patterns"]

module.exports = {
    companies,
    studyterms
}
run();

async function run(){
    // start the browser
    let browser = await puppeteer.launch({
        defaultViewport: null,
        args: [
            "--start-maximized"
        ],
        headless: false
    });

    // get a tab
    let pages = await browser.pages();
    let page = pages[0];

    // go to url
    await page.goto(args.url);

    // click on get started under explore

    await page.waitForSelector("p.link");
    await page.click("p.link");

    // click on discuss 

    await page.waitForSelector("a[href='/discuss/']");
    await page.click("a[href='/discuss/']");
    
    //click on interview experience if choice is 1
    if(args.choice == 1)
    {
        await page.waitForSelector("a[href='/discuss/interview-experience']")
        await page.click("a[href='/discuss/interview-experience']");
    }

    //click on Compensation if choice is 2
    if(args.choice == 2)
    {
        await page.waitForSelector("a[href='/discuss/compensation']")
        await page.click("a[href='/discuss/compensation']");
    }
    //Click on Study Guide if choice is 3
    if(args.choice == 3)
    {
        await page.waitForSelector("a[href='/discuss/study-guide']");
        await page.click("a[href='/discuss/study-guide']")
    }
    if(args.choice == 1 || args.choice == 2)
    {
    for(let i = 0;i<companies.length;i++)
    {
        let str = companies[i];
        await page.waitForSelector("#discuss-container > div > div > div.css-1894crh-MainContainer.e5i1odf2 > div.css-sjryrr-LeftPane.e5i1odf3 > div > div:nth-child(2) > div > span > input");
        await page.click("#discuss-container > div > div > div.css-1894crh-MainContainer.e5i1odf2 > div.css-sjryrr-LeftPane.e5i1odf3 > div > div:nth-child(2) > div > span > input")
        await page.waitFor(1000);
        await page.keyboard.type(str, {
            delay:500
        });
        await page.waitFor(3000);
        await page.keyboard.press('Enter');
        // await page.waitForSelector(".css-os8bm0");
        await page.waitForSelector("a[class='title-link__1ay5']");
        
        let readUrls = await page.$$eval("a[class='title-link__1ay5']",function(tags)
        {
            let s = "https://leetcode.com";
            let curls = [];
            for(let i = 0;i<tags.length;i++)
            {
                let url = tags[i].getAttribute("href")
                curls.push(s+url);
            }
            return curls;
        })
        // console.log(reUrls);
        for(let i = 0; i<readUrls.length; i++){
            let newTab = await browser.newPage();
            await func(newTab,readUrls,i,str);
            await newTab.close();
            await page.waitFor(2000);
        }
        await page.waitForSelector("#discuss-container > div > div > div.css-1894crh-MainContainer.e5i1odf2 > div.css-sjryrr-LeftPane.e5i1odf3 > div > div:nth-child(2) > div > span > input");
        await page.click("#discuss-container > div > div > div.css-1894crh-MainContainer.e5i1odf2 > div.css-sjryrr-LeftPane.e5i1odf3 > div > div:nth-child(2) > div > span > input");
        for(let i = 0;i<14;i++)
        {
            await page.keyboard.press('Backspace');
        }
    }
    }
    if(args.choice == 3)
    {
        for(let i = 0;i<studyterms.length;i++)
        {
            let str = studyterms[i];
            await page.waitForSelector("#discuss-container > div > div > div.css-1894crh-MainContainer.e5i1odf2 > div.css-sjryrr-LeftPane.e5i1odf3 > div > div:nth-child(2) > div > span > input");
            await page.click("#discuss-container > div > div > div.css-1894crh-MainContainer.e5i1odf2 > div.css-sjryrr-LeftPane.e5i1odf3 > div > div:nth-child(2) > div > span > input")
            await page.waitFor(1000);
            //To handle haphazard erase, clear input box before typing 
            for(let i = 0;i<30;i++)
            {
                await page.keyboard.press('Backspace',300);
            }
            await page.keyboard.type(str, {
                delay:500
            });
            
            await page.keyboard.press('Enter');
            await page.waitFor(3000);
            
           
            await page.waitForSelector("a[class='title-link__1ay5']");
            
            let rUrls = await page.$$eval("a[class='title-link__1ay5']",function(tags)
            {
                let s = "https://leetcode.com";
                let curls = [];
                for(let i = 0;i<tags.length;i++)
                {
                    let url = tags[i].getAttribute("href")
                    curls.push(s+url);
                }
                return curls;
            })
            console.log(rUrls);
            for(let i = 0; i<rUrls.length; i++){
                let newTab = await browser.newPage();
                await page.waitFor(2000);
                await func(newTab,rUrls,i,str);
                await newTab.close();
                await page.waitFor(2000);
            }
            await page.waitForSelector("#discuss-container > div > div > div.css-1894crh-MainContainer.e5i1odf2 > div.css-sjryrr-LeftPane.e5i1odf3 > div > div:nth-child(2) > div > span > input");
            await page.click("#discuss-container > div > div > div.css-1894crh-MainContainer.e5i1odf2 > div.css-sjryrr-LeftPane.e5i1odf3 > div > div:nth-child(2) > div > span > input");
            for(let i = 0;i<30;i++)
            {
                await page.keyboard.press('Backspace',300);
            }
        }
    }
    browser.close();
}

async function func(newTab,readUrls,i,str)
{
    await newTab.goto(readUrls[i]);
    await newTab.waitFor(3000);
    await newTab.waitForSelector("h5");
    let title = await newTab.$eval("h5",function(tag)
    {
        return tag.getAttribute("title");
    })
    //console.log(title);
    await newTab.waitForSelector(".content-area__2vnF > .discuss-markdown-container > *");
    let content = await newTab.$$eval(".content-area__2vnF > .discuss-markdown-container > *",function(tag)
    {
        let arr = [];
        for(let i = 0;i<tag.length;i++)
        {
            arr.push(tag[i].innerHTML);
        }
        return arr;
    })
    console.log(content);
    if(fs.existsSync("./"+"\\"+str) == false)
    {
        fs.mkdirSync("./"+"\\"+ str);
    }
    
    let s = "";
    for(let i = 0;i<content.length;i++)
    {
            s+=content[i];
    }
    let a = "";
    let k = i+1;
    if(args.choice == 1)
    {
        a = "./"+"\\"+"Experience"+k+".html";
    }
    if(args.choice == 2)
    {
        a = "./"+"\\"+"Compensation"+k+".html";
    }
    if(args.choice == 3)
    {
        a = "./"+"\\"+"Study"+k+".html";
    }
    let st = "<a href='"+a+"'>"+"Link to next page"+"</a>"
    s = "<html>"+"<h1>" + title + "</h1><br>" + s +"<br>" + st + "</html>";
    if(args.choice == 1)
    {
        fs.writeFileSync("./"+"\\"+str+"\\"+"Experience"+i+".html",s,"utf-8");
    }
    if(args.choice == 2)
    {
        fs.writeFileSync("./"+"\\"+str+"\\"+"Compensation"+i+".html",s,"utf-8");
    }
    if(args.choice == 3)
    {
        fs.writeFileSync("./"+"\\"+str+"\\"+"Study"+i+".html",s,"utf-8");
    }
    await newTab.waitFor(3000);
}
