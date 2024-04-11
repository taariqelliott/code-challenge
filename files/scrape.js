const fileSystem = require("fs");
const puppeteer = require("puppeteer");

async function scrapeAndSaveArtworks() {
  const puppeteerBrowser = await puppeteer.launch();
  const page = await puppeteerBrowser.newPage();
  await page.goto("http://127.0.0.1:5500/files/van-gogh-paintings.html");

  const artworks = await page.$$eval(
    "#_c2yRXMvVOs3N-QazgILgAg93 .MiPcId.klitem-tr.mlo-c > a",
    (elements) =>
      elements.map((e) => ({
        name: e.querySelector(".kltat").innerText,
        extensions: Array.from(
          e.querySelectorAll(".ellip.klmeta"),
          (ext) => ext.innerText
        ),
        link: `https://www.google.com${e.getAttribute("href")}`,
        image:
          e.querySelector(".rISBZc.M4dUYb").getAttribute("src") !== undefined
            ? e.querySelector(".rISBZc.M4dUYb").getAttribute("src")
            : null,
      }))
  );

  const artworkData = { artworks };
  const savedFileName = "vangogh-taariq-elliott.json";

  fileSystem.writeFile(savedFileName, JSON.stringify(artworkData), (err) => {
    if (err) throw err;
    console.log(`Saved file ${savedFileName} successfully!`);
  });

  await puppeteerBrowser.close();
}

scrapeAndSaveArtworks();
