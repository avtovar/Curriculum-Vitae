var fs = require('fs');
var path = require('path');

var pdfPath = 'c:\\Users\\avtov\\Downloads\\Informe_Completo_CV_Ali-Tovar.pdf';

// Nuevos metadatos a inyectar
var NEW_TITLE = 'CV Ali Valentin Tovar Morales - QA Engineer';
var NEW_AUTHOR = 'Ali Valentin Tovar Morales';
var NEW_SUBJECT = 'Portafolio profesional - QA Engineer';

try {
  var data = fs.readFileSync(pdfPath, 'utf8');
  
  // Reemplazar Título
  var titleOld = '/Title (Informe completo: repositorio y sitio del CV)';
  var titleNew = '/Title (' + NEW_TITLE + ')';
  if (data.includes(titleOld)) {
    data = data.replace(titleOld, titleNew);
    console.log('✅ Título actualizado');
  } else {
    console.log('⚠️ Título original no encontrado (puede estar codificado differently)');
    // Intentar con variaciones
    var titleOld2 = '/Title';
    if (data.includes(titleOld2)) {
      // Buscar y reemplazar el contenido después de /Title
      var regex = new RegExp('/Title \\([^)]+\\)', 'g');
      data = data.replace(regex, titleNew);
      console.log('✅ Título reemplazado con expresión regular');
    }
  }
  
  // Reemplazar Autor
  var authorOld = '/Author (Claude)';
  var authorNew = '/Author (' + NEW_AUTHOR + ')';
  if (data.includes(authorOld)) {
    data = data.replace(authorOld, authorNew);
    console.log('✅ Autor actualizado');
  } else {
    console.log('⚠️ Autor no encontrado con formato esperado');
    var authorOld2 = '/Author';
    if (data.includes(authorOld2)) {
      var regex = new RegExp('/Author \\([^)]+\\)', 'g');
      data = data.replace(regex, authorNew);
      console.log('✅ Autor reemplazado con expresión regular');
    }
  }
  
  // Reemplazar Sujeto
  var subjectOld = '/Subject \\(unspecified\\)';
  var subjectNew = '/Subject (' + NEW_SUBJECT + ')';
  if (data.includes(subjectOld)) {
    data = data.replace(subjectOld, subjectNew);
    console.log('✅ Sujeto actualizado');
  } else {
    console.log('⚠️ Sujeto no encontrado con formato esperado');
    var subjectOld2 = '/Subject';
    if (data.includes(subjectOld2)) {
      var regex = new RegExp('/Subject \\([^)]+\\)', 'g');
      data = data.replace(regex, subjectNew);
      console.log('✅ Sujeto reemplazado con expresión regular');
    }
  }
  
  // Guardar el PDF modificado
  var outPath = pdfPath.replace('.pdf', '-modificado.pdf');
  fs.writeFileSync(outPath, data, 'utf8');
  console.log('📄 PDF modificado guardado en: ' + outPath);
  console.log('Tamaño:', fs.statSync(outPath).size, 'bytes');
} catch (e) {
  console.error('❌ Error:', e.message);
}