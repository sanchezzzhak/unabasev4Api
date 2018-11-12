import main from '../main';
const restartPassword = ({ origin = '', lang = 'es', id = '' }) => {
  let text;
  switch (lang) {
    case 'es':
      text = {
        content: `<p style="font-size=1.5rem">
        Has solitado reestablecer tu contraseña,
        sigue el siguiente <a href="${origin}/restart?id=${id}">Enlace</a> para establecer una nueva.
      </p>`
      };
      break;
    case 'en':
      text = {
        content: `<p style="font-size=1.5rem">
        You have requested to reset your password,
        follow the  <a href="${origin}/restart?id=${id}">Link</a> to set a new one.
      </p>`
      };
      break;
  }
  return main(text);
};

export default restartPassword;
