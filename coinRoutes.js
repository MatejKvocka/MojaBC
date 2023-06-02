const express = require('express');
const router = express.Router();
const Coin = require('../models/coin');

// Get all coins
router.get('/coins', (req, res) => {
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
router.get('/user/:userId/collectedCoins', (req, res) => {
  const userId = req.params.userId;
  User.findById(userId, (err, user) => {
    if (err) {
      console.error('Error retrieving user:', err);
      res.status(500).send('An error occurred while retrieving user.');
    } else {
      const collectedCoins = user.collectedCoins;
      Coin.find({ _id: { $in: collectedCoins } }, (err, coins) => {
        if (err) {
          console.error('Error retrieving collected coins:', err);
          res.status(500).send('An error occurred while retrieving collected coins.');
        } else {
          res.json(coins);
        }
      });
    }
  });
});

// Collect a coin for a user
router.post('/user/:userId/collect', (req, res) => {
  const userId = req.params.userId;
  const coinId = req.body.coinId;
  User.findByIdAndUpdate(userId, { $addToSet: { collectedCoins: coinId } }, (err) => {
    if (err) {
      console.error('Error collecting coin:', err);
      res.status(500).send('An error occurred while collecting coin.');
    } else {
      res.sendStatus(200);
    }
  });
});

// Remove a coin from a user's collection
router.post('/user/:userId/remove', (req, res) => {
  const userId = req.params.userId;
  const coinId = req.body.coinId;
  User.findByIdAndUpdate(userId, { $pull: { collectedCoins: coinId } }, (err) => {
    if (err) {
      console.error('Error removing coin:', err);
      res.status(500).send('An error occurred while removing coin.');
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
