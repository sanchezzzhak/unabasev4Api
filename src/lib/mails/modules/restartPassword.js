import main from '../main';
const restartPassword = ({ origin = '' }) => {
  return main({
    content: `
     Has solicitado reiniciar tu contraseña
    `
  });
};

export default restartPassword;
