// updateImage.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/updateImage', (req, res) => {
    const { username, imageName, updates } = req.body;

    if (!username || !imageName || !updates) {
        return res.status(400).send('Username, image name, or updates were not provided.');
    }

    const jsonFilePath = path.join(__dirname, '../database/photosByUsername.json');

    try {
        let data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        
        const userIndex = data.findIndex((entry) => entry.hasOwnProperty(username));

        if (userIndex !== -1) {
            const userImages = data[userIndex][username];
            const imageIndex = userImages.findIndex((img) => img.name === imageName);

            if (imageIndex !== -1) {
                const imageToUpdate = userImages[imageIndex];
                for (const key in updates) {
                    if (Object.prototype.hasOwnProperty.call(updates, key) && Object.prototype.hasOwnProperty.call(imageToUpdate, key)) {
                        imageToUpdate[key] = updates[key];
                    }
                }

                fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing JSON file:', writeErr);
                        return res.status(500).send('Failed to update JSON file.');
                    }
                    res.send('Image updated successfully.');
                });
            } else {
                res.status(404).send('Image not found.');
            }
        } else {
            res.status(404).send('User not found.');
        }
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        res.status(500).send('Error updating image.');
    }
});

module.exports = router;
