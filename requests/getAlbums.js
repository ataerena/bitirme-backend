const express = require('express');
const userData = require('../database/users.json');

const router = express.Router();

router.post('/getAlbums', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send('Username not provided.');
    }

    const user = userData.find((user) => user.username === username);

    if (!user || !user.albums) {
        return res.status(404).send('User not found or no albums found for the user.');
    }

    res.json({ albums: user.albums });
});

module.exports = router;