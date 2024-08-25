import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Chip, Grid, Typography, Stack } from '@mui/material';
import axios from 'axios';
import EventDetailDialog from './EventDetailDialog';

function EventCard({ event }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [eventDetails, setEventDetails] = useState(null);
    
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const getOnlyDate = (endDate) => {
        return endDate ? endDate.slice(0, 11) : "";
    };

    const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5000/eventdetails');
          const events = response.data;

          setEventDetails(events);
          console.log("Event Deatils: ", events);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);

    return (
        <>
            <Card 
                className="max-w-s p-4 bg-white rounded-lg shadow-lg cursor-pointer" 
                onClick={handleOpenDialog}
            >
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CardMedia
                                component="img"
                                alt={event.title}
                                height="180"
                                image={event.imageURL}
                                title={event.name}
                                className="rounded-lg"
                            />
                        </Grid>
                        <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1}>
                                <Chip label={event.location} />
                                <Chip label={getOnlyDate(event.endDate)} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" component="h2">
                                {event.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary">
                                {event.descriptions}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <EventDetailDialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                events={eventDetails} 
            />
        </>
    );
}

export default EventCard;