// This script removes AdminLayout wrappers from admin pages since they're now nested routes

const filesToFix = [
  'c:\\Users\\Leela Madhava Rao\\OneDrive\\Desktop\\innoverse\\frontend\\src\\pages\\admin\\gallery.jsx',
  'c:\\Users\\Leela Madhava Rao\\OneDrive\\Desktop\\innoverse\\frontend\\src\\pages\\admin\\teams.jsx',
  'c:\\Users\\Leela Madhava Rao\\OneDrive\\Desktop\\innoverse\\frontend\\src\\pages\\admin\\faculty.jsx',
  'c:\\Users\\Leela Madhava Rao\\OneDrive\\Desktop\\innoverse\\frontend\\src\\pages\\admin\\evaluators.jsx',
  'c:\\Users\\Leela Madhava Rao\\OneDrive\\Desktop\\innoverse\\frontend\\src\\pages\\admin\\evaluations.jsx'
];

console.log('Files that need AdminLayout removal:', filesToFix);
