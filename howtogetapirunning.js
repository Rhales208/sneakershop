const express = require('express');
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const credentials = require('./credentials.json');

const app = express();
const PORT = process.env.PORT || 3000;

function connectToFirestore() {
  if(!getApps().length) {
    initializeApp({
      credential: cert(credentials)
    });
  }
  return getFirestore();
}


app.get('/restaurants', (req, res) => {
  const db = connectToFirestore();
  db.collection('restaurants').get()
    .then(snapshot => {
      const restaurants = snapshot.docs.map(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        return restaurant
      });
      res.status(200).send(restaurants);
    })
    .catch(console.error);
})


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));