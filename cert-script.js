document.getElementById("certForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("studentName").value;
  const course = document.getElementById("courseName").value;
  const date = new Date().toLocaleDateString();

  const { PDFDocument, rgb, StandardFonts } = PDFLib;
  const pdfDoc = await PDFDocument.create();

  // Set page dimensions. (Width 800, height 600)
  const pageWidth = 800;
  const pageHeight = 600;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Font sizes and declarations
  const titleFontSize = 36;       // For the main title ("CERTIFICATE OF COMPLETION")
  const subtitleFontSize = 24;    // For "Presented to" and organization name
  const nameFontSize = 40;        // For the candidate's name (largest)
  const textFontSize = 22;        // For the course and date
  const borderThickness = 5;      // Decorative border

  // Embed fonts to give a professional, readable feel (Times fonts work well for certificates)
  const titleFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // STEP 1: Draw graduation background image (ensure "graduates.jpg" exists and path is correct)
  try {
    const bgUrl = "graduates.jpg"; // update with a valid path if necessary
    const bgBytes = await fetch(bgUrl).then(res => res.arrayBuffer());
    const bgImage = await pdfDoc.embedJpg(bgBytes);
    page.drawImage(bgImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      opacity: 0.3 // a subtle transparency so that text is legible
    });
  } catch (err) {
    console.warn("Background image could not be loaded:", err);
  }

  // STEP 2: Draw a decorative border around the certificate
  page.drawRectangle({
    x: borderThickness / 2,
    y: borderThickness / 2,
    width: pageWidth - borderThickness,
    height: pageHeight - borderThickness,
    borderColor: rgb(0, 0, 0),
    borderWidth: borderThickness,
  });

  // To help with centering, create a helper function:
  const centerText = (text, font, size) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    return (pageWidth - textWidth) / 2;
  };

  // STEP 3: Draw the Title ("CERTIFICATE OF COMPLETION") centered near the top
  const title = "CERTIFICATE OF COMPLETION";
  page.drawText(title, {
    x: centerText(title, titleFont, titleFontSize),
    y: 520,
    size: titleFontSize,
    font: titleFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  // STEP 4: Draw "Presented to" centered below the title
  const presentedText = "Presented to";
  page.drawText(presentedText, {
    x: centerText(presentedText, bodyFont, subtitleFontSize),
    y: 460,
    size: subtitleFontSize,
    font: bodyFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  // STEP 5: Draw the candidate's name centered
  page.drawText(name, {
    x: centerText(name, titleFont, nameFontSize),
    y: 410,
    size: nameFontSize,
    font: titleFont,
    color: rgb(0, 0, 0.6),
  });

  // STEP 6: Draw course completion text centered
  const courseText = `For successfully completing ${course}`;
  page.drawText(courseText, {
    x: centerText(courseText, bodyFont, textFontSize),
    y: 360,
    size: textFontSize,
    font: bodyFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  // STEP 7: Draw the date centered below the course
  const dateText = `Date: ${date}`;
  page.drawText(dateText, {
    x: centerText(dateText, bodyFont, textFontSize),
    y: 310,
    size: textFontSize,
    font: bodyFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  // STEP 8: Draw the organization name ("Rayopro7") centered near the bottom
  const orgText = "Rayopro7";
  page.drawText(orgText, {
    x: centerText(orgText, titleFont, subtitleFontSize),
    y: 260,
    size: subtitleFontSize,
    font: titleFont,
    color: rgb(0, 0, 0),
  });

  // STEP 9: Optionally, add a signature image below the organization name
  try {
    const signatureUrl = "signature.png"; // update with your signature file's location
    const sigBytes = await fetch(signatureUrl).then(res => res.arrayBuffer());
    const sigImage = await pdfDoc.embedPng(sigBytes);
    const sigWidth = 150;
    const sigHeight = 50;
    page.drawImage(sigImage, {
      x: (pageWidth - sigWidth) / 2,
      y: 180,
      width: sigWidth,
      height: sigHeight,
    });
  } catch (err) {
    console.warn("Signature image could not be loaded:", err);
  }

  // STEP 10: Save and trigger download of the generated PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name.replace(/\s+/g, '_')}_certificate.pdf`;
  link.click();

  document.getElementById("statusMessage").innerText = "✅ Certificate downloaded!";
});






