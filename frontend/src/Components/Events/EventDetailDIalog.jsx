import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const EventDetailDialog = ({ event }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [eventDataList, setEventDataList] = useState([]);

    const fetchData = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/eventdata');
        const events = response.data;
        const today = new Date();

        const upcomingEvents = events.filter(event => new Date(event.startDate) > today);
        const pastEvents = events.filter(event => new Date(event.endDate) < today);

        setEventDataList(events);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Button onClick={handleClickOpen}>Open Event Detail</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Event Detail</DialogTitle>
                <DialogContent>
                    {/* Render event details here */}
                    <p>{event.title}</p>
                    <p>{event.date}</p>
                    <p>{event.description}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EventDetailDialog;