const bcrypt = require('bcrypt');

const password = "5244"
bcrypt.hash(password, 10, function (err, encryptedpassword) {
    if (err) console.log(err);
    else {
        console.log(encryptedpassword);
    }
})