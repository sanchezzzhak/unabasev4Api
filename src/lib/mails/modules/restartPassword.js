import main from '../main';
const restartPassword = ({ origin = '', lang = 'es', id = '' }) => {
  let content;
  let subject;
  switch (lang) {
    case 'es':
      content = `<p style="font-size=1.5rem">
        Has solitado reestablecer tu contraseña,
        sigue el siguiente <a href="${origin}/restart?id=${id}">Enlace</a> para establecer una nueva.
      </p>`;
      subject = `Has solicitado reestablecer tu contraseña`;
      break;
    case 'en':
      content = `<p style="font-size=1.5rem">
        You have requested to reset your password,
        follow the  <a href="${origin}/restart?id=${id}">Link</a> to set a new one.
      </p>`;
      subject = `You have resquest to reset your password`;
      break;
  }
  return main({ lang, content, subject });
};

export default restartPassword;
