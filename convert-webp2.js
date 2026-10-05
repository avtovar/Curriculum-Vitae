// Script to convert <img> tags to <picture> with WebP fallback in index.html
// Only converts img tags that are NOT already inside a <picture> element
import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Guard: if every media img already has a <picture> wrapper, there is nothing to do.
const openPictures = (html.match(/<picture>/g) || []).length;
const mediaImgs = (html.match(/<img\s+src="media\//g) || []).length;
if (mediaImgs > 0 && openPictures >= mediaImgs) {
  console.log('ℹ️  All media <img> tags already wrapped in <picture>. Nothing to do.');
  process.exit(0);
}

function convertImgToPicture(html) {
  let result = '';
  let i = 0;
  const len = html.length;
  let inPicture = false;
  let pictureDepth = 0;
  
  while (i < len) {
    // Check for <picture> opening
    if (html.startsWith('<picture>', i)) {
      pictureDepth++;
      inPicture = true;
      result += '<picture>';
      i += 9;
      continue;
    }
    
    // Check for </picture> closing
    if (html.startsWith('</picture>', i)) {
      pictureDepth = Math.max(0, pictureDepth - 1);
      inPicture = pictureDepth > 0;
      result += '</picture>';
      i += 10;
      continue;
    }
    
    // Check for <img tag
    if (html.startsWith('<img', i) && !inPicture) {
      // Find the end of this img tag
      let tagEnd = html.indexOf('>', i);
      if (tagEnd === -1) {
        result += html[i];
        i++;
        continue;
      }
      
      const imgTag = html.substring(i, tagEnd + 1);
      
      // Extract src attribute
      const srcMatch = imgTag.match(/src="([^"]+)"/);
      if (srcMatch) {
        const src = srcMatch[1];
        // Check if it's a media image (jpg, jpeg, png)
        if (src.startsWith('media/') && /\.(jpg|jpeg|png)$/i.test(src)) {
          const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          // Wrap in picture element
          result += `<picture>\n              <source srcset="${webpSrc}" type="image/webp">\n              ${imgTag}\n            </picture>`;
          i = tagEnd + 1;
          continue;
        }
      }
      
      // Not a media image or no src, keep as is
      result += imgTag;
      i = tagEnd + 1;
      continue;
    }
    
    // Regular character
    result += html[i];
    i++;
  }
  
  return result;
}

const result = convertImgToPicture(html);
fs.writeFileSync('index.html', result);
console.log('✅ Converted all img tags to picture with WebP fallback (no nesting)');