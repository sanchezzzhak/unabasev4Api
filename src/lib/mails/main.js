const footerImg = `http://statics.una.cl/img/logohd.png`;
const footerHtml = new Map();
footerHtml.set(
  'es',
  `
<img src=${footerImg} alt="Unabase" height="130" width="300">
<h5>
Te solicitamos no responder el presente email.</h5>`
);
footerHtml.set(
  'en',
  `
<img src=${footerImg} alt="Unabase" height="130" width="300">
<h5>
Please don't reply this email.</h5>`
);

export default ({
  lang = 'es',
  title = 'Unabase',
  content = '',
  subject = ''
}) => {
  let text;
  switch (lang) {
    case 'es':
      text = `<!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${title}</title>
      </head>
      <body>
        <div>${content}</div>
        <footer>${footerHtml.get(lang)}</footer>
      </body>
      </html>`;

      break;
    case 'en':
      text = `<!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${title}</title>
      </head>
      <body>
        <div>${content}</div>
        <footer>${footerHtml.get(lang)}</footer>
      </body>
      </html>`;
      break;
  }
  // return `<!DOCTYPE html>
  // <html lang="${lang}">
  // <head>
  //   <meta charset="UTF-8">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <meta http-equiv="X-UA-Compatible" content="ie=edge">
  //   <title>${title}</title>
  // </head>
  // <body>
  //   <div>${content}</div>
  //   <footer>${footer}</footer>
  // </body>
  // </html>`;
  return { text, subject };
};
