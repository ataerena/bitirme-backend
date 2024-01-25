const usersFilePath = '../database/users.json';

const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

function generateToken(length) {
  return crypto.randomBytes(length).toString('hex');
}

function loginUser(req, res) {
  const { username, password } = req.body;

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user.username === username);

    bcrypt.compare(password, user.hashedPassword, function(err, result) {
        if (err) {
          console.error('Password comparison error:', err);
        } else if (result) {
          const token = generateToken(32);

          const tokenDestroyTime = Date.now() + 3600000; // 3600000 ms = 1 hour
        
          res.status(200).json({ message: 'Login successful', token, destroyTime: tokenDestroyTime });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
    });

    /* if (login == true) {
      console.log("LOGIN IN CONDITIONS: ",login);
      const token = generateToken(32);

      const tokenDestroyTime = Date.now() + 3600000; // 3600000 ms = 1 hour

      user.token = {
        value: token,
        destroyTime: tokenDestroyTime,
      };

      res.status(200).json({ message: 'Login successful', token, destroyTime: tokenDestroyTime });
    } else {
      console.log("LOGIN IN CONDITIONS: ",login);
      res.status(401).json({ message: 'Invalid credentials' });
    } */
  });
}

module.exports = { loginUser };
