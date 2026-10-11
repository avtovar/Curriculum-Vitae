var fs = require('fs');
var data = fs.readFileSync('c:\\Users\\avtov\\Downloads\\Informe_Completo_CV_Ali-Tovar.pdf', 'utf8');
console.log('Size:', data.length);
var titleMatch = data.match(/\\/Title \(([^)]+)\)/);
var authorMatch = data.match(/\\/Author \(([^)]+)\)/);
var subjectMatch = data.match(/\\/Subject \(([^)]+)\)/);
console.log('Title:', titleMatch ? titleMatch[1] : 'not found');
console.log('Author:', authorMatch ? authorMatch[1] : 'not found');
console.log('Subject:', subjectMatch ? subjectMatch[1] : 'not found');
var pageCount = 0;
var idx = 0;
while (true) {
  idx = data.indexOf('/Type /Page', idx);
  if (idx === -1) break;
  pageCount++;
  idx++;
}
console.log('Pages:', pageCount);
var streamCount = (data.match(/stream/g) || []).length;
console.log('Streams:', streamCount);