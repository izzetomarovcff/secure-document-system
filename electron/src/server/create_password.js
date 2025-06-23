
const bcrypt = require('bcryptjs');
bcrypt.hash('admin', 10, (err, hash) => {
  console.log(hash);
});
