const express = require('express');
const userData = require('../database/users.json'); // Ensure correct path to your user data
const router = express.Router();

router.post('/reauthenticate', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username or password not provided.');
    }

    const user = userData.find((user) => user.username === username);

    if (!user || user.password !== password) {
        return res.status(401).send('Invalid username or password.');
    }

    // Successful reauthentication
    res.status(200).send('Reauthentication successful.');
});

module.exports = router;
