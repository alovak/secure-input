export default function addFonts(fonts, loadedCallback) {
  if (!fonts.cssSrc) return;

  const whiteListedUrls = [
    /^https\:\/\/use\.typekit\.net\/.+\.css$/,
    /^https\:\/\/fonts\.googleapis\.com\/css\?family.+/
  ]

  const result = whiteListedUrls.find( regExp => fonts.cssSrc.match(regExp) );

  if (!result) {
    console.log('font src does not match allowed sources');
    return;
  }
  
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('link');
  style.href = fonts.cssSrc;
  style.type = 'text/css';
  style.rel = 'stylesheet';
  head.append(style);

  if (loadedCallback) style.addEventListener('load', loadedCallback);
}
