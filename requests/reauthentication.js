const express = require('express');
const userData = require('../../database/users.json');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/reauthenticate', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username or password not provided.');
    }

    const user = userData.find((user) => user.username === username);

    bcrypt.compare(password, user.hashedPassword, function(err, result) {
        if (err) {
          console.error('Password comparison error:', err);
        } else if (result) {
            res.status(200).send('Reauthentication successful.');
        } else {
            return res.status(401).send('Invalid username or password.');
        }
    });

});

module.exports = router;
