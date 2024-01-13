const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const detection = require('./yoloDetection');
const axios = require('axios');

const router = express.Router();
router.use(fileUpload());

async function processImage(labelPath, username) {
    try {
        var label = await fs.readFileSync(labelPath, 'utf8');

        var upperCaseLabel = label.toUpperCase();

        const createAlbum = {
            username: username,
            albumName: upperCaseLabel
        };

        if (label.length !== 0) {
            const response = await axios.post('http://localhost:9000/create/createAlbum', createAlbum);
            console.log(response.data);
        } else {
            console.log('LABEL IS UNDEFINED');
        }
        
    } catch (error) {
        console.error(`Error processing image: ${error.message}`);
    }

    return upperCaseLabel;
}

router.post('/upload', async (req, res) => {
    if (!req.files || !req.files.image || !req.body.username) {
        return res.status(400).send('Username or image was not provided.');
    }

    const image = req.files.image;
    const username = req.body.username;
    const jsonFilePath = '../database/photosByUsername.json';
    const labelPath = './result.txt';

    const base64Data = image.data.toString('base64');
    await detection(base64Data);
    var label = await processImage(labelPath, username);
    console.log('LABEL IS: ', label);
    console.log('LABEL TYPE IS: ', typeof label);
    console.log('LABEL LENGTH IS: ', label.length);

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

            if (label.length == 0){
                existingUserImages[existingImageIndex] = {
                    name: image.name,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetype
                    }
                };
            }
            else {
                existingUserImages[existingImageIndex] = {
                    name: image.name,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [label],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetype
                    }
                };
            }
            
        } else {
            if (label.length == 0){
                existingUserImages.push({
                    name: image.name,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetyp
                    }
                });
            }
            else {
                existingUserImages.push({
                    name: image.name,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [label],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetype
                    }
                });
            }
            
        }
    } else {
        if ( label.length == 0){
            var newUserEntry = {
                [username]: [{
                    name: image.name,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetype
                    }
                }]
            };
        }
        else {
            var newUserEntry = {
                [username]: [{
                    name: image.name,
                    favorite: false,
                    restricted: false,
                    deleted: false,
                    archived: false,
                    albums: [label],
                    base64: {
                        data: base64Data,
                        mimetype: image.mimetype
                    }
                }]
            };
        }
        
        
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

module.exports = router;