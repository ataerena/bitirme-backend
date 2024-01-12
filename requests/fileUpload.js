const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const detection = require('./yoloDetection');
const axios = require('axios');

const router = express.Router();

router.use(fileUpload());

router.post('/upload', async (req, res) => {
    if (!req.files || !req.files.image || !req.body.username) {
        return res.status(400).send('Username or image was not provided.');
    }

    const image = req.files.image;
    const username = req.body.username;
    const jsonFilePath = '../database/photosByUsername.json';
    const labelPath = './result.txt';
    var label = "";

    const base64Data = image.data.toString('base64');
    await detection(base64Data)

    fs.readFile(labelPath, 'utf8', (err, data) => {
        if (err){
            console.error(`Error reading label: ${err.message}`)
        }
        else {
            label = data;

            const upperCaseLabel = label.toUpperCase();
            var myImageNames = [];
            myImageNames.push(image.name);

            const createAlbum = {
                username: username, 
                albumName: upperCaseLabel
            }

            const addToAlbum = {
                username: username,
                albumName: upperCaseLabel,
                imageNames: myImageNames
            }

            if (label.length != 0){
                axios.post('http://localhost:9000/create/createAlbum', createAlbum)
                    .then( res => {
                        console.log(res)
                    })
                    .catch( err => {
                        console.log(err);
                    })

                axios.post('http://localhost:9000/add/addImagesToAlbum', addToAlbum)
                .then( res => {
                    console.log(res)
                })
                .catch( err => {
                    console.log(err);
                })    
            }
            else {
                console.log('LABEL IS UNDEFINED');
            }
        }
    })

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
            // If the image with the same name exists, update its data
            existingUserImages[existingImageIndex] = {
                name: image.name,
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

module.exports = router;