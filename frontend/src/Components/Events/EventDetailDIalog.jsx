import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function EventDetailDialog({ open, onClose, events }) {
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            aria-labelledby="event-details-title"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="event-details-title">
                {events ? events.name : 'Event Details'}
            </DialogTitle>
            <DialogContent>
                {events ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Location: {events.Location}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Date: {events.endDate}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {events.descriptions}
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