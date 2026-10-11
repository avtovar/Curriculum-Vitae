var fs = require('fs');
var { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function main() {
  try {
    // 1. Leer el PDF modificado (informe)
    var informePath = 'c:\\Users\\avtov\\Downloads\\Informe_Completo_CV_Ali-Tovar-modificado.pdf';
    var informeBytes = fs.readFileSync(informePath);
    
    // 2. Leer el PDF principal (CV)
    var cvPath = 'media/Ali_Tovar_CV.pdf';
    var cvBytes = fs.readFileSync(cvPath);
    
    // 3. Crear nuevo PDF document
    var pdfDoc = await PDFDocument.create();
    
    // 4. Agregar portada
    var page = pdfDoc.addPage([595.2756, 841.8898]); // A4 size
    var timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
    // Título de portada
    page.getGraphics().fillText('CV Ali Valentin Tovar Morales', 200, 700);
    page.getGraphics().fillText('QA Engineer | Manual & Automation Web/Mobile', 200, 650);
    page.getGraphics().fillText('Experiencia en Banca Digital y Fintech', 200, 600);
    page.getGraphics().fillText('ali.v.tovar@gmail.com', 200, 550);
    
    // 5. Agregar páginas del informe modificado
    var pagesFromInforme = await pdfDoc.copyPages(informeBytes, [1, 2, 3, 4]);
    pagesFromInforme.forEach(function(page) {
      pdfDoc.addPage(page);
    });
    
    // 6. Agregar página de datos del CV
    var pageCv = pdfDoc.addPage([595.2756, 841.8898]);
    var cvFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    pageCv.getGraphics().fillText('Datos Resumen del CV', 200, 750);
    pageCv.getGraphics().fillText('QA Engineer con 5+ anos en banca digital y fintech', 200, 700);
    pageCv.getGraphics().fillText('Experiencia en Brubank (abril 2021 - Presente)', 200, 650);
    pageCv.getGraphics().fillText('Testing Manual y Automatizacion (Maestro, Python, Postman)', 200, 600);
    pageCv.getGraphics().fillText('Skills: Testing Manual, Automation, API Testing, QA Documentation', 200, 550);
    
    // 7. Guardar PDF combinado
    var combinedBytes = await pdfDoc.save();
    var outputPath = 'CV_Completo_Ali_Tovar.pdf';
    fs.writeFileSync(outputPath, combinedBytes);
    console.log('✅ PDF combinado creado: ' + outputPath);
    console.log('Tamaño:', fs.statSync(outputPath).size, 'bytes');
    
    // 8. Mostrar info de páginas
    var totalPages = pdfDoc.getPageIndices().length + 4; // 4 from informe + 2 added
    console.log('Total de paginas aproximadas:', totalPages);
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

main();