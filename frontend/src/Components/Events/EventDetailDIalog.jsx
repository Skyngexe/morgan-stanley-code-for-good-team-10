import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Stack, Chip, Container } from '@mui/material';

function EventDetailDialog({ open, onClose, event }) {
    const getOnlyDate = (endDate) => {
        return endDate ? endDate.slice(0, 10) : "";
    };

    function DetailItem({ title, detail }) {
        return (
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-base text-gray-600">{detail}</p>
            </div>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="event-details-title"
            maxWidth="lg"
            fullWidth
            className="font-sans rounded-lg" // Rounded edges
        >
            <Container className="mb-2 bg-yellow rounded-t-lg">
                <DialogTitle id="event-details-title" className="text-left text-2xl font-bold p-4">
                    {event ? event.name : 'Event Details'}
                </DialogTitle>
            </Container>
            <DialogContent className="flex p-4">
                <div className="flex-initial w-1/3 pr-4">
                    <img src={event ? event.imageURL : ''} alt={event ? event.name : ''} className="w-full h-auto rounded shadow" />
                </div>
                <div className="w-px bg-gray-300 mx-4 my-2"></div>
                <div className="flex-auto">
                    <Stack spacing={2}>
                        {event ? (
                            <>
                                <Stack direction="row" spacing={1}>
                                    <Chip label={"Theme: " + event.eventType} color="error" variant="filled" />
                                    <Chip label={event.fee_detail} color="error" variant="filled" />
                                    <Chip label={"Quota: " + event.quota} color="error" variant="filled" />
                                </Stack>
                                <DetailItem title="Location" detail={event.Location} />
                                <DetailItem title="Date" detail={getOnlyDate(event.endDate.$date)} />
                                <DetailItem title="Eligibility" detail={event.eligibility} />
                                <DetailItem title="Description" detail={event.descriptions_detail} />
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </Stack>
                </div>
            </DialogContent>
            <DialogActions className="p-4">
                <Button onClick={onClose} className="bg-blue hover:bg-blue text-white font-bold py-2 px-4 rounded">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EventDetailDialog;