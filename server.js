const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Coin = require('./models/coins');
const User = require('./models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/eurocoins', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// API endpoint to retrieve coin data
app.get('/api/coins', verifyToken, async (req, res) => {
  try {
    const coins = await Coin.find();
    res.json(coins);
  } catch (error) {
    console.error('Error retrieving coins:', error);
    res.status(500).json({ error: 'Failed to retrieve coins' });
  }
});

// New endpoint for retrieving all unique years
app.get('/api/coins/years', verifyToken, async (req, res) => {
  try {
    const years = await Coin.distinct('year');
    res.json(years);
  } catch (error) {
    console.error('Error retrieving years:', error);
    res.status(500).json({ error: 'Failed to retrieve years' });
  }
});

// New endpoint for retrieving all unique countries
app.get('/api/coins/countries', verifyToken, async (req, res) => {
  try {
    const countries = await Coin.distinct('country');
    res.json(countries);
  } catch (error) {
    console.error('Error retrieving countries:', error);
    res.status(500).json({ error: 'Failed to retrieve countries' });
  }
});

// Get a specific coin by ID
app.get('/api/coins/:id', verifyToken, async (req, res) => {
  const coinId = req.params.id;

  try {
    const coin = await Coin.findById(coinId);
    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }
    res.json(coin);
  } catch (error) {
    console.error('Error retrieving coin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    // Create a new user
    const user = new User({ name, email, password});
    await user.save();

    // Generate and sign the authentication token
    const token = jwt.sign({ userId: user._id }, 'FLU8Gqmxky8RJJJx', { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login a user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Sent email: ", email);
    console.log("Sent Password: ", password);
    const user = await User.findOne({ email });
    console.log("Stored Hashed Password: ", user.password);
    console.log("User: ", user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("matched Password: ", isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate a JWT token with the user's ID and any other necessary data
    const token = jwt.sign({ userId: user._id }, 'FLU8Gqmxky8RJJJx', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
});

// Collect a coin for a user
app.post('/api/user/:userId/collect', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const coinId = req.body.coinId;

    console.log(userId, coinId); // Debugging log

    const user = await User.findById(userId);
    if (user && !user.collectedCoins.includes(coinId)) {
      user.collectedCoins.push(coinId);
      await user.save();
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// Remove a coin from a user's collection
app.delete('/api/user/:userId/collect/:coinId', verifyToken, async (req, res) => {
  try {
    const { userId, coinId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.collectedCoins.indexOf(coinId);
    if (index !== -1) {
      user.collectedCoins.splice(index, 1);
      await user.save();
      return res.json(user);
    } else {
      return res.status(400).json({ message: 'Coin not in collection' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// Get all coins
app.get('/api/coins/all', verifyToken, (req, res) => {
  Coin.find({}, (err, coins) => {
    if (err) {
      console.error('Error retrieving coins:', err);
      res.status(500).send('An error occurred while retrieving coins.');
    } else {
      res.json(coins);
    }
  });
});

// Get collected coins for a user
app.get('/api/user/:userId/collectedCoins', verifyToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const collectedCoins = user.collectedCoins;
    const coins = await Coin.find({ _id: { $in: collectedCoins } });

    res.json(coins);
  } catch (error) {
    console.error('Error retrieving collected coins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function verifyToken(req, res, next) {
  // Extract token from Authorization header
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    // Verify the token
    jwt.verify(token, 'FLU8Gqmxky8RJJJx', (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Store the user ID from the token payload in the request for later use
      req.userId = decoded.userId;
      next();
    });
  } else {
    return res.status(401).json({ error: 'No token provided' });
  }
}
app.get('/api/user/:userId/coinStats', async (req, res) => {
  const userId = req.params.userId;

  // Fetch user and the coins collected by the user
  const user = await User.findById(userId);
  const coins = await Coin.find({ '_id': { $in: user.collectedCoins } });

  // Total number of coins and total number of coins collected
  const totalCoins = await Coin.countDocuments({});
  const totalCoinsCollected = coins.length;

  // Average value of coins collected
  let totalValue = 0;
  coins.forEach(coin => {
    totalValue += coin.value;
  });
  const avgValue = totalValue / totalCoinsCollected;

  // Number of coins collected per country
  const coinsPerCountry = {};
  coins.forEach(coin => {
    if (!coinsPerCountry[coin.country]) {
      coinsPerCountry[coin.country] = 0;
    }
    coinsPerCountry[coin.country]++;
  });

  // Total number of coins per country
  const totalCoinsPerCountry = await Coin.aggregate([
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    totalCoins,
    totalCoinsCollected,
    avgValue,
    coinsPerCountry,
    totalCoinsPerCountry,
  });
});




// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
