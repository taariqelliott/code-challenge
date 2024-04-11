const fileSystem = require("fs");
const puppeteer = require("puppeteer");

async function scrapeAndSaveArtworks() {
  const puppeteerBrowser = await puppeteer.launch();
  const page = await puppeteerBrowser.newPage();
  await page.goto("http://127.0.0.1:5500/files/van-gogh-paintings.html");

  const artworks = await page.$$eval(
    "#_c2yRXMvVOs3N-QazgILgAg93 .MiPcId.klitem-tr.mlo-c a",
    (elements) =>
      elements.map((e) => {
        const name = e.querySelector(".kltat").innerText;
        const extensions = e.querySelectorAll(".ellip.klmeta");
        const link = `https://www.google.com${e.getAttribute("href")}`;
        const image =
          e.querySelector(".rISBZc.M4dUYb").getAttribute("src") !== undefined
            ? e.querySelector(".rISBZc.M4dUYb").getAttribute("src")
            : null;

        // Construct the object with the desired order of properties
        const artworkObj = {
          name,
          // Conditionally add extensions property if extensions exist
          ...(extensions.length > 0 && {
            extensions: Array.from(extensions, (ext) => ext.innerText),
          }),
          link,
          image,
        };

        return artworkObj;
      })
  );

  const artworkData = { artworks };
  const fileName = "vangogh-taariq-elliott.json";

  fileSystem.writeFile(fileName, JSON.stringify(artworkData), (err) => {
    if (err) throw err;
    console.log(`Saved file ${fileName} successfully!`);
  });

  await puppeteerBrowser.close();
}

scrapeAndSaveArtworks();
