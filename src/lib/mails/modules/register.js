import main from '../main';
const register = ({
  password = '',
  origin = '',
  activateHash = '',
  id = ''
}) => {
  return main({
    content: `<p style="font-size=1.5rem">
    Estamos contentos de tenerte con nosotros! <br/>
  ingresa <a href="${origin}/login?hash=${activateHash}&id=${id}&verifyAccount=true">aquí</a> para verificar tu cuenta.  
  </p>`
  });
  //  return `Tu clave de ingreso es: <br/> ${password} <br/>
  // ingresa <a href="${
  //   req.headers.origin
  // }/verify/${activateHash}?id=${
  //   user._id
  // }">aquí</a> para verificar tu cuenta.

  // `
};

export default register;
