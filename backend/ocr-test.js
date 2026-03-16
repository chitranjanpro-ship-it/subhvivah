const Tesseract = require("tesseract.js");

async function runOCR() {

  const image = "https://tesseract.projectnaptha.com/img/eng_bw.png";

  const result = await Tesseract.recognize(
    image,
    "eng"
  );

  console.log("Extracted Text:");
  console.log(result.data.text);

}

runOCR();