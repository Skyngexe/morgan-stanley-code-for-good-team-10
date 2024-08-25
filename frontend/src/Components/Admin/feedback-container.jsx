import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  feedbackButton: {
    backgroundColor: '#f7f779', // light yellow background
    color: '#000000', // black text
    '&:hover': {
      backgroundColor: 'lightyellow'
    }
  },
  cardGrid: {
    maxWidth: 360,
    flexGrow: 1
  }
});

function FeedbackContainer() {

  const [pastEventsList, setPastEventsList] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const classes = useStyles();
  
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/read/events');
      const events = response.data;
      const today = new Date();
      const pastEvents = events.filter(event => new Date(event.endDate) < today);

      setPastEventsList(pastEvents);
      console.log("Past events:", pastEvents);
      console.log("events:", events);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchFeedback = async (formId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/form/question_and_responses/${formId}`);
      setFeedbackData(response.data);
      console.log("Feedback data:", response.data);

    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getOnlyDate = (endDate) => {
    return endDate ? endDate.slice(0, 10) : "";
  };

  return (
    <Container className="mt-8">
      <div className="text-3xl font-bold mb-4 pt-20">
        Event Feedback
      </div>
      <Grid container spacing={3} justifyContent="center">
        {pastEventsList.map(event => (
          <Grid item key={event.ID} xs={12} sm={6} md={4} className={classes.cardGrid}>
            <Card variant="outlined" className="hover:shadow-lg transition-shadow">
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  {event.name}
                </Typography>
                <Typography color="textSecondary">
                  Location: {event.location}
                </Typography>
                <Typography color="textSecondary">
                  Event Date: {getOnlyDate(event.endDate.$date)}
                </Typography>
                <Typography color="textSecondary">
                  Type: {event.eventType}
                </Typography>
                <Button
                  size="small"
                  className={classes.feedbackButton}
                  onClick={() => fetchFeedback(event.feedback_form_id)}
                  style={{ marginTop: '16px' }}
                >
                  Show Feedback
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default FeedbackContainer;