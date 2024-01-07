const express = require('express');
const fs = require('fs');
const photosData = require('../../database/photosByUsername.json');
const router = express.Router();

router.post('/addImagesToAlbum', (req, res) => {
    const { username, albumName, imageNames } = req.body;

    if (!username || !albumName || !imageNames || !Array.isArray(imageNames)) {
        return res.status(400).send('Invalid request body.');
    }

    // Find the user's photos
    const userPhotos = photosData.find((user) => Object.keys(user)[0] === username);

    if (!userPhotos) {
        return res.status(404).send('User photos not found.');
    }

    // Update 'albums' property for each image in 'imageNames'
    imageNames.forEach((imageName) => {
        const imageIndex = userPhotos[username].findIndex((image) => image.name === imageName);

        if (imageIndex !== -1) {
            // If the image is found, add the 'albumName' to its 'albums' array
            if (!userPhotos[username][imageIndex].albums.includes(albumName)) {
                userPhotos[username][imageIndex].albums.push(albumName);
            }
        }
    });

    // Rewrite the updated photos data back to the JSON file
    fs.writeFileSync('../database/photosByUsername.json', JSON.stringify(photosData, null, 2));

    res.status(200).send('Album name added to images successfully.');
});


module.exports = router;
