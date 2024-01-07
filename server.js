const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { loginUser } = require('./requests/login');
const { registerUser } = require('./requests/register');
const fileUploadRouter = require('./requests/fileUpload');
const getImagesRouter = require('./requests/getImages');
const updateImageRouter = require('./requests/updateImage');
const getAlbumsRouter = require('./requests/getAlbums');
const reauthenticationRouter = require('./requests/reauthentication');
const createAlbumRouter = require('./requests/createAlbum');
const deleteAlbumRouter = require('./requests/deleteAlbum');

const app = express();

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Your existing routes
app.post('/login', loginUser);
app.post('/register', registerUser);
app.use('/file', fileUploadRouter);
app.post('/getimages', getImagesRouter);
app.use('/update', updateImageRouter);
app.use('/get', getAlbumsRouter);
app.use('/auth', reauthenticationRouter);
app.use('/create', createAlbumRouter);
app.use('/delete', deleteAlbumRouter);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});