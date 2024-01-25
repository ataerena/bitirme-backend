const express = require('express');
const fs = require('fs');

const router = express.Router();

router.post('/getimages', (req, res) => {
    if (!req.body.username) {
        return res.status(400).send('Username was not provided.');
    }

    const username = req.body.username;
    const jsonFilePath = '../database/photosByUsername.json';

    try {
        const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        const userImages = data.find((entry) => entry.hasOwnProperty(username));

        if (userImages) {
            res.json(userImages[username]);
        } else {
            res.status(404).send('User not found or has no images.');
        }
    } catch (error) {
        console.error('Error reading JSON file:', error);
        res.status(500).send('Failed to retrieve user images.');
    }
});

module.exports = router;
