import React from 'react';
import { Stack, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import { Link } from "react-router-dom";
import styles from "../styles/card-menu.module.css"; // Custom styles if needed

const CardMenu = () => {
  return (
    <div className="mx-auto max-w-5xl mt-8 pt-40">
      <Stack direction="column" spacing={4} alignItems="center">
        <Typography variant="h5" component="h2" className="text-center">
          Please select an option below:
        </Typography>
        <div className="grid grid-cols-3 gap-6">
          <CardLink to="/admin/create-event" title="Create Event" description="Create an event here." />
          <CardLink to="/admin/view-events" title="Manage Events" description="View and manage all your events here." />
          <CardLink to="/admin/view-feedbacks" title="View Feedbacks" description="View feedback from your participants." />
        </div>
      </Stack>
    </div>
  );
};

const CardLink = ({ to, title, description }) => (
  <Link to={to} className="no-underline">
    <Card raised elevation={3}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Link>
);

export default CardMenu;