// Script to convert <img> tags to <picture> with WebP fallback in index.html
import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Guard: if every media img already has a <picture> wrapper, there is nothing to do.
const openPictures = (html.match(/<picture>/g) || []).length;
const mediaImgs = (html.match(/<img\s+src="media\//g) || []).length;
if (mediaImgs > 0 && openPictures >= mediaImgs) {
  console.log('ℹ️  All media <img> tags already wrapped in <picture>. Nothing to do.');
  process.exit(0);
}

// Helper to convert img tags to picture with webp source
function convertImgToPicture(html, selector) {
  // Pattern to match <img src="media/..." ...> and convert to <picture><source srcset="...webp" type="image/webp"><img ...></picture>
  // We need to handle different paths: media/Diplomas/..., media/Titulo/..., media/*.jpg|jpeg|png
  
  return html.replace(/<img\s+src="([^"]+\.(?:jpg|jpeg|png))"([^>]*?)>/gi, (match, src, rest, offset) => {
    // Skip if already inside a picture element (check preceding context)
    const beforeMatch = html.substring(0, offset);
    if (beforeMatch.includes('<picture>') && beforeMatch.lastIndexOf('<picture>') > beforeMatch.lastIndexOf('</picture>')) {
      return match; // Already wrapped
    }
    
    // Generate webp src
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Keep data-i18n-alt, alt, class, loading attributes on the img
    return `<picture>\n              <source srcset="${webpSrc}" type="image/webp">\n              <img src="${src}"${rest}>\n            </picture>`;
  });
}

// Convert all img tags in media/ folder
let result = html;

// First, let's be more careful - only convert specific img tags that are direct image references
// We'll do it section by section to avoid breaking anything

// Pattern for diploma images: <img src="media/Diplomas/..." class="diploma-img" ...>
result = result.replace(
  /<img\s+src="media\/Diplomas\/([^"]+\.(?:jpg|jpeg|png))"([^>]*?)>/gi,
  (match, filename, rest) => {
    const webpSrc = `media/Diplomas/${filename.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
    return `<picture>\n              <source srcset="${webpSrc}" type="image/webp">\n              <img src="media/Diplomas/${filename}"${rest}>\n            </picture>`;
  }
);

// Pattern for Titulo images
result = result.replace(
  /<img\s+src="media\/Titulo\/([^"]+\.(?:jpg|jpeg|png))"([^>]*?)>/gi,
  (match, filename, rest) => {
    const webpSrc = `media/Titulo/${filename.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
    return `<picture>\n              <source srcset="${webpSrc}" type="image/webp">\n              <img src="media/Titulo/${filename}"${rest}>\n            </picture>`;
  }
);

// Pattern for root media images (company logos)
result = result.replace(
  /<img\s+src="media\/([^\/"]+\.(?:jpg|jpeg|png))"([^>]*?)>/gi,
  (match, filename, rest) => {
    const webpSrc = `media/${filename.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
    return `<picture>\n              <source srcset="${webpSrc}" type="image/webp">\n              <img src="media/${filename}"${rest}>\n            </picture>`;
  }
);

fs.writeFileSync('index.html', result);
console.log('✅ Converted all img tags to picture with WebP fallback');