import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Stack, Chip } from '@mui/material';

function EventDetailDialog({ open, onClose, event }) {
    const getOnlyDate = (endDate) => {
        return endDate ? endDate.slice(0, 10) : "";
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            aria-labelledby="event-details-title"
            maxWidth="lg"
            fullWidth
            className="font-sans"
        >
            <Grid container justifyContent="center">
                <Stack direction="column" spacing={2}>
                    <DialogTitle id="event-details-title" className="text-xl font-bold">
                        {event ? event.name : 'Event Details'}
                    </DialogTitle>
                    <Stack direction="row" spacing={2}>
                        <Grid container justifyContent="center" spacing={5}>
                            <img src={event ? event.imageURL : ''} alt={event ? event.name : ''} className="w-full h-auto p-2.5" />
                        </Grid>
                        <DialogContent className="text-base">
                            {event ? (
                                <>
                                    <div className="font-medium mb-2">
                                        Location: {event.location_detail}
                                    </div>
                                    <div className="font-medium mb-2">
                                        Date: {getOnlyDate(event.endDate.$date)}
                                    </div>
                                    <div className="font-medium mb-2">
                                        Date: {getOnlyDate(event.endDate.$date)}
                                    </div>
                                    <div className="font-medium mb-2">
                                        Date: {getOnlyDate(event.endDate.$date)}
                                    </div>
                                    <div className="font-medium mb-2">
                                        Date: {getOnlyDate(event.endDate.$date)}
                                    </div>
                                    <p className="mb-4 text-ml">
                                        {event.descriptions_detail}
                                    </p>
                                    <Stack direction="row" spacing={1}>
                                        <Chip label={event.fee_detail} />
                                        <Chip label={event.quota} />
                                    </Stack>
                                    {/* Additional details can be added here */}
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </DialogContent>
                    </Stack>
                </Stack>
            </Grid>

            <DialogActions>
                <Button onClick={onClose} color="primary" className="bg-blue-500 hover:bg-blue-600 text-white font-medium">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EventDetailDialog;