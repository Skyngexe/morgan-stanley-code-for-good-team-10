import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container, Card, CardContent, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stack } from '@mui/material';
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
  const [feedbackData, setFeedbackData] = useState({ responses: { responses: [] } });
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();
  
  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/read/events');
      const events = response.data;
      const today = new Date();
      const pastEvents = events.filter(event => new Date(event.endDate) < today);

      setPastEventsList(pastEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchFeedback = async (formId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/form/item/${formId}`);
      setFeedbackData(response.data);
      console.log("Feedback data:", feedbackData);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getOnlyDate = (endDate) => {
    return endDate ? endDate.slice(0, 11) : "";
  };

  const aggregateAnswersByQuestion = (responses) => {
    const answersByQuestion = {};
  
    responses.forEach(response => {
      Object.entries(response.answers).forEach(([questionId, answerDetail]) => {
        if (!answersByQuestion[questionId]) {
          answersByQuestion[questionId] = [];
        }
  
        // Assuming the structure of answerDetail.textAnswers.answers is consistent as per the data
        answerDetail.textAnswers.answers.forEach(answer => {
          answersByQuestion[questionId].push(answer.value);
        });
      });
    });
  
    return answersByQuestion;
  };

  const renderDialog = () => {
    if (!feedbackData.responses || !feedbackData.responses.responses) {
      return null; // or some loading indicator
    }
  
    const answersByQuestion = aggregateAnswersByQuestion(feedbackData.responses.responses);
  
    return (
      <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="feedback-dialog-title" maxWidth="md" fullWidth>
        <Container className="mb-2 bg-yellow rounded-t-lg">
          <DialogTitle id="feedback-dialog-title" style={{fontWeight: 'bold'}}>
            Feedback Details
          </DialogTitle>
        </Container>
        <DialogContent>
          {Object.entries(answersByQuestion).map(([questionId, answers]) => (
            <div key={questionId} className="mb-5">
              <Typography variant="h6" className="border-b border-gray-300 pb-2" style={{fontWeight: 'bold'}}>
                {feedbackData.questions && feedbackData.questions[questionId]}
              </Typography>
              <div className="max-h-36 overflow-y-auto mt-2">
                {answers.map((answer, index) => (
                  <Typography key={index} variant="body2" className="mb-1">{answer}</Typography>
                ))}
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" style={{color: 'black'}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container className="m-8">
      <div className="text-3xl font-bold mb-4 pt-20">Event Feedback</div>
      <Grid container spacing={3} justifyContent="center">
        {pastEventsList.map(event => (
          <Grid item key={event.ID} xs={12} sm={6} md={4} className={classes.cardGrid}>
            <Card variant="outlined" className="hover:shadow-lg transition-shadow">
              <CardContent>
                <Typography variant="body1" gutterBottom>{event.name}</Typography>
                <Typography color="textSecondary">Location: {event.location}</Typography>
                <Typography color="textSecondary">Event Date: {getOnlyDate(event.endDate)}</Typography>
                <Typography color="textSecondary">Type: {event.eventType}</Typography>
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
      {renderDialog()}
    </Container>
  );
}

export default FeedbackContainer;