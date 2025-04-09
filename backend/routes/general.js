import express from 'express';
import Event from '../models/event.js';
import League from '../models/league.js';

const router = express.Router();

router.post('/new-event', async (req, res) => {
    try {

        const { type, date, time, location, homeTeam, awayTeam, league } = req.body;

        const newEvent = new Event({
          type,
          date,
          time,
          location,
          homeTeam,
          awayTeam,
          league,
        });

        const savedEvent = await newEvent.save();

        res.status(201).json({ message: 'Event registered', event: savedEvent });
    } catch (error) {
        console.error('Error registering event:', error);
        res.status(500).json({ error: 'Failed to register event' });
    }
  });

router.post('/new-league', async (req, res) => {
    try {
        
        const { name } = req.body;
        const newLeague = new League({ name });

        const savedLeague = await newLeague.save();

        res.status(201).json({ message: 'League registered', league: savedLeague });
    } catch (error) {
        console.error('Error registering league:', error);
        res.status(500).json({ error: 'Failed to register league' });
    }
});

router.get('/all-events', async (req, res) => {
    try {
      const events = await Event.find().populate('league'); 
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

router.get('/all-leagues', async (req, res) => {
    try {
      const leagues = await League.find();  
      res.status(200).json(leagues);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      res.status(500).json({ error: 'Failed to fetch leagues' });
    }
});

export default router;