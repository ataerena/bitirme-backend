const express = require('express');
const fs = require('fs');
const userData = require('../../database/users.json');
const router = express.Router();

router.post('/deleteAlbum', (req, res) => {
    const { username, albumName } = req.body;

    if (!username || !albumName) {
        return res.status(400).send('Username or album name not provided.');
    }

    const user = userData.find((user) => user.username === username);

    if (!user) {
        return res.status(404).send('User not found.');
    }

    if (!user.albums || !user.albums.includes(albumName)) {
        return res.status(400).send('Album does not exist for the user.');
    }

    user.albums = user.albums.filter((album) => album !== albumName);

    fs.writeFileSync('../database/users.json', JSON.stringify(userData, null, 2));

    res.status(200).send('Album deleted successfully.');
});

module.exports = router;
