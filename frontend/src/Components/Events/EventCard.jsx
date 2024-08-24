import React from 'react';
import { Chip, Box, Grid, Typography, Card, CardMedia, CardContent, Stack } from '@mui/material';

function EventCard({ event }) {
  return (
    <Card className="max-w-s p-4 bg-white rounded-lg shadow-lg">
      <CardContent>
        <Grid container>
            <Stack direction="column" spacing={2}>
                <Grid item xs={12}>
                    <CardMedia
                        component="img"
                        alt={event.title}
                        height="180px"
                        image={event.imageURL}
                        title={event.name}
                        className="rounded-lg"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="textSecondary">
                        {event.location}
                    </Typography>
                    <Chip label={event.endDate} />
                    </Box>
                </Grid>
                <Grid item xs={12} height={70}>
                    <Typography variant="h5" component="h2">
                    {event.name}
                    </Typography>
                </Grid>
                <Grid item xs={12} height={70}>
                    <Typography variant="body1" color="textSecondary">
                    {event.descriptions}
                    </Typography>
                </Grid>
            </Stack>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default EventCard;