import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function EventDetailDialog({ open, onClose, event }) {
    const getOnlyDate = (endDate) => {
        return endDate ? endDate.slice(0, 10) : "";
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            aria-labelledby="event-details-title"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="event-details-title">
                {event ? event.name : 'Event Details'}
            </DialogTitle>
            <DialogContent>
                {event ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Location: {event.location_detail}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Date: {getOnlyDate(event.endDate.$date)}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {event.descriptions_detail}
                        </Typography>
                        {/* You can add more details here */}
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EventDetailDialog;