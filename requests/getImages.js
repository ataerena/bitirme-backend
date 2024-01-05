const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/getimages', (req, res) => {
    if (!req.body.username) {
        return res.status(400).send('Username was not provided.');
    }

    const username = req.body.username;
    const jsonFilePath = path.join(__dirname, '../database/photosByUsername.json');

    // Reading the JSON file
    try {
        const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

        // Finding the user's images based on the provided username
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
