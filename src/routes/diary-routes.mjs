import express from 'express';
import { body, validationResult } from 'express-validator';
import DiaryEntry from '../models/diaryEntry.js'; // Tuodaan käyttöön päiväkirjamallin
import User from '../models/user.js';

const router = express.Router();

// POST-pyyntö uuden päiväkirjamerkinnän tallentamiseksi
router.post(
  '/api/diary', [
    // Lisää tarvittaessa tietojen validointi
    body('date').isDate(),
    body('mood').isIn(['Neutraali', 'Hyvä', 'Erinomainen', 'Huono', 'Todella huono']),
    body('weight').isNumeric(),
    body('sleep').isNumeric(),
    body('exerciseDuration').isNumeric(),
    body('exerciseIntensity').isIn(['Kevyt', 'Kohtalainen', 'Raskas']),
    body('content').isString(),
  ],
  async (req, res) => {
    // Tarkista, löytyykö validointivirheitä
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Etsi käyttäjä tietokannasta käyttäjänimen perusteella
      const username = req.body.username;
      const user = await User.findOne({ username });

      // Tarkista, onko käyttäjä olemassa
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Luodaan uusi päiväkirjamerkintä
      const newDiaryEntry = new DiaryEntry({
        user_id: user._id, // Olettaen, että käyttäjän id on tallennettu pyynnön mukana (esim. JWT-tietokentässä)
        entry_date: req.body.date,
        mood: req.body.mood,
        weight: req.body.weight,
        sleep_hours: req.body.sleep,
        exercise_duration: req.body.exerciseDuration,
        exercise_intensity: req.body.exerciseIntensity,
        notes: req.body.content,
      });

      // Tallennetaan uusi päiväkirjamerkintä tietokantaan
      const savedEntry = await newDiaryEntry.save();
      res.status(201).json(savedEntry); // Palautetaan tallennettu päiväkirjamerkintä
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error'); // Virhetilanteessa lähetetään 500-virhekoodi
    }
  }
);

// GET-pyyntö käyttäjän vanhojen päiväkirjamerkintöjen hakemiseksi
router.get('/api/diary/history', async (req, res) => {
  try {
    // Hae käyttäjän vanhat päiväkirjamerkinnät tietokannasta
    const userId = req.user.id; // Olettaen, että käyttäjän id on tallennettu pyynnön käyttäjäolioon
    const diaryEntries = await DiaryEntry.find({ user_id: userId }); // Olettaen, että käyttäjän id on tietokantamallissa kenttänä user_id

    // Palauta haetut päiväkirjamerkinnät vastauksena
    res.status(200).json(diaryEntries);
  } catch (error) {
    console.error('Virhe käyttäjän päiväkirjamerkintöjen haussa:', error);
    res.status(500).json({ message: 'Jotain meni pieleen. Yritä uudelleen myöhemmin.' });
  }
});

export default router;
