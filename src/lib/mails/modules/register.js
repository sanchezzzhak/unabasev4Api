import main from '../main';
const register = ({
  password = '',
  origin = '',
  activateHash = '',
  id = '',
  lang = 'es'
}) => {
  let text;
  switch (lang) {
    case 'es':
      text = {
        content: `<p style="font-size=1.5rem">
        Estamos contentos de tenerte con nosotros! <br/>
      ingresa <a href="${origin}/login?hash=${activateHash}&id=${id}&verifyAccount=true">aquí</a> para verificar tu cuenta.  
      </p>`
      };
      break;
    case 'en':
      text = {
        content: `<p style="font-size=1.5rem">
     We are happy to have you with us! <br/>
    click <a href="${origin}/login?hash=${activateHash}&id=${id}&verifyAccount=true">here</a> to verify your account.  
    </p>`
      };
      break;
  }
  return main(text);
};

export default register;
