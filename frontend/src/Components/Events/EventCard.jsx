import React from 'react';
import { Chip, Box, Grid, Typography, Card, CardMedia, CardContent, Stack } from '@mui/material';

function EventCard({ event }) {

    function getOnlyDate(endDate) {
        if (endDate) {
            // Split the string at the comma and return the first part
            return endDate.slice(0, 11);
        }
        return ""; // Return an empty string if endDate is undefined or null
    }

    return (
        <Card className="max-w-s p-4 bg-white rounded-lg shadow-lg">
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
            <Grid item xs={12} container justify="space-between" alignItems="center" >
                <Stack direction="row" spacing={1}>
                    <Chip label={event.location} />
                    <Chip label={getOnlyDate(event.endDate)} />
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h2" className="line-clamp-2">
                {event.name}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" className="line-clamp-3">
                {event.descriptions}
                </Typography>
            </Grid>
            </Grid>
        </CardContent>
        </Card>
    );
}

export default EventCard;