import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Chip, Grid, Typography, Stack } from '@mui/material';
import EventDetailDialog from './EventDetailDIalog';

function EventCard({ event }) {
    const [openDialog, setOpenDialog] = useState(false);
    
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const getOnlyDate = (endDate) => {
        return endDate ? endDate.slice(0, 10) : "";
    };

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
                                <Chip label={getOnlyDate(event.endDate.$date)} />
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
            <EventDetailDialog open={openDialog} onClose={handleCloseDialog} event={event} />
        </>
    );
}

export default EventCard;