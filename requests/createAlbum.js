const express = require('express');
const fs = require('fs');
const userData = require('../../database/users.json');
const router = express.Router();

router.post('/createAlbum', (req, res) => {
    const { username, albumName } = req.body;

    if (!username || !albumName) {
        return res.status(400).send('Username or album name not provided.');
    }

    const user = userData.find((user) => user.username === username);

    if (!user) {
        return res.status(404).send('User not found.');
    }

    // Check if the album already exists for the user
    if (user.albums && user.albums.includes(albumName)) {
        return res.status(400).send('Album already exists for the user.');
    }

    // Update the user's albums array
    if (!user.albums) {
        user.albums = []; // Initialize albums array if not present
    }
    user.albums.push(albumName);

    // Rewrite the updated user data back to the JSON file
    fs.writeFileSync('../database/users.json', JSON.stringify(userData, null, 2));

    res.status(200).send('Album created successfully.');
});

module.exports = router;
