const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.use(fileUpload());

router.post('/upload', (req, res) => {
    if (!req.files || !req.files.image || !req.body.username) {
        return res.status(400).send('Username or image was not provided.');
    }

    const image = req.files.image;
    const username = req.body.username;
    const directory = path.join(__dirname, `../uploaded_images/${username}`);
    const jsonFilePath = path.join(__dirname, '../database/photosByUsername.json');

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    image.mv(`${directory}/${image.name}`, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Convert the image to Base64
        const base64Data = fs.readFileSync(`${directory}/${image.name}`, { encoding: 'base64' });

        // Reading the JSON file
        let data = [];
        try {
            data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        } catch (error) {
            console.error('Error reading JSON file:', error);
        }

        // Check if the username already exists in the database
        const existingUserIndex = data.findIndex((entry) => entry.hasOwnProperty(username));

        if (existingUserIndex !== -1) {
            // If the username exists, check if the image with the same name exists for the user
            const existingUserImages = data[existingUserIndex][username];
            const existingImageIndex = existingUserImages.findIndex((img) => img.name === image.name);

            if (existingImageIndex !== -1) {
                // If the image with the same name exists, replace it with the new image object
                existingUserImages[existingImageIndex] = {
                    name: image.name,
                    path: `${directory}/${image.name}`,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetype // Optionally store mimetype for reference
                    }
                };
            } else {
                // If the image doesn't exist, push the new image data as an object into the user's array
                existingUserImages.push({
                    name: image.name,
                    path: `${directory}/${image.name}`,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetype // Optionally store mimetype for reference
                    }
                });
            }
        } else {
            // If the username doesn't exist, create a new entry with an array containing the image data
            const newUserEntry = {
                [username]: [{
                    name: image.name,
                    path: `${directory}/${image.name}`,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetype // Optionally store mimetype for reference
                    }
                }]
            };

            // Push the new entry into the JSON data
            data.push(newUserEntry);
        }

        // Write the updated JSON data back to the file
        fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing JSON file:', writeErr);
                return res.status(500).send('Failed to update JSON file.');
            }
            res.send('File uploaded successfully.');
        });
    });
});

module.exports = router;
