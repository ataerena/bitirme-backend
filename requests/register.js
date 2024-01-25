const usersFilePath = '../database/users.json';
const fs = require('fs');
const bcrypt = require('bcrypt');

function registerUser(req, res) {
  const { username, password } = req.body;

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    const users = JSON.parse(data);
    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    console.log(hashedPassword);
    const newUser = { username, hashedPassword };
    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        res.status(500).json({ message: 'Failed to register user' });
        return;
      }

      res.status(201).json({ message: 'User registered successfully' });
    });
  });
}

module.exports = { registerUser };