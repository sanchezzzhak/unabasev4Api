// export default url => {
//   if (url === '/users') return 'personal';
//   else if (url === '/business') return 'business';
// };

export default url => (url === '/users' ? 'personal' : 'business');
