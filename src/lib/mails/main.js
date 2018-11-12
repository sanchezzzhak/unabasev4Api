const footerHtml = `
<img src="http://statics.una.cl/img/logohd.png" alt="Unabase" height="150" width="300">
<h5>
Te solicitamos no responder el presente email.</h5>`;

export default ({
  language = 'es',
  title = 'Unabase',
  content = '',
  footer = footerHtml
}) => {
  return `<!DOCTYPE html>
  <html lang="${language}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
  </head>
  <body>
    <div>${content}</div>
    <footer>${footer}</footer>
  </body>
  </html>`;
};
