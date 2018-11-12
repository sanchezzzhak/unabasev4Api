import main from '../main';
const register = ({
  password = '',
  origin = '',
  activateHash = '',
  id = '',
  lang = 'es',
  name = ''
}) => {
  let content;
  let subject;
  switch (lang) {
    case 'es':
      content = `<p style="font-size=1.5rem">
        Estamos contentos de tenerte con nosotros! <br/>
      ingresa <a href="${origin}/login?hash=${activateHash}&id=${id}&verifyAccount=true">aquí</a> para verificar tu cuenta.  
      </p>`;
      subject = `Hola! ${name} bienvenido a Unabase!`;

      break;
    case 'en':
      content = `<p style="font-size=1.5rem">
     We are happy to have you with us! <br/>
    click <a href="${origin}/login?hash=${activateHash}&id=${id}&verifyAccount=true">here</a> to verify your account.  
    </p>`;
      subject = `Hello! ${name} welcome to Unabase!`;
      break;
  }

  return main({ lang, content, subject });
};

export default register;
