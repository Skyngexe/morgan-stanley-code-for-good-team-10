import React from 'react';
import Carousel from '../components/events/Carousel';
import TimerCountdown from '../components/events/TimerCountdown';
import RSVPForm from '../components/events/RsvpForm';

function EventPage() {
  const upcomingEvents = [
    {
      title: "Marketing Strategy Seminar",
      date: "Jul 11",
      location: "Marketing Department",
      description: "Seminar on the latest marketing strategies and trends.",
      image: "https://d19d5sz0wkl0lu.cloudfront.net/dims4/default/59e5ecf/2147483647/resize/800x%3E/quality/90/?url=https%3A%2F%2Fatd-brightspot.s3.amazonaws.com%2F77%2Fd1%2F62bd27e34677a8d4ee0dad57990e%2Fadobestock-209215591.jpeg",
    },
    {
      title: "Employee Wellness Workshop",
      date: "Jul 28",
      location: "Health and Wellness Center",
      description: "Workshop focused on employee health and wellness.",
      image: "https://www.samyama.org/wp-content/uploads/2023/01/Corporate-Wellness-SAMYAMA.jpg",
    },
    {
      title: "Data Analysis Training",
      date: "Aug 2",
      location: "Data Science Lab",
      description: "Training session on data analysis techniques and tools.",
      image: "https://microsoft-office-courses.co.uk/wp-content/uploads/2019/10/shutterstock_701604637-min.jpg",
    },
    {
      title: "Annual Company Outing",
      date: "Aug 17",
      location: "Resort",
      description: "An off-site retreat for employees to relax and bond.",
      image: "https://cdn.prod.website-files.com/61eb3f79cfe8dd4bf6350818/63ff7b38bcf6a055318acdfd_PACE-EmmaCrystalWorkshop-2-scaled.webp",
    }
  ];

  const pastEvents = [
    {
      title: "Office BBQ Party",
      date: "May 25",
      location: "Office Terrace",
      description: "An office gathering with BBQ and fun activities.",
      image: "https://www.postable.com/blog/wp-content/uploads/2016/06/dinner-party-barbecue-and-roast-pork-at-night-picture-id931644570.jpg",
    },
    {
      title: "Sales Training",
      date: "May 28",
      location: "Sales Department",
      description: "Training session for the sales team to improve their techniques.",
      image: "https://elearningindustry.com/wp-content/uploads/2021/08/LMS-For-Corporate-Training-Find-Your-Perfect-Fit.png",
    },
    {
      title: "IT Security Awareness Workshop",
      date: "Jun 2",
      location: "IT Department",
      description: "Workshop to educate employees about IT security practices.",
      image: "https://www.secion.de/assets/images/9/secion-cyber-security-workshop-01-816bbe24.jpg",
    },
    {
      title: "Customer Service Excellence Training",
      date: "Jun 5",
      location: "Customer Service Department",
      description: "Training session for customer service representatives.",
      image: "https://cdn.prod.website-files.com/5f55ff47b6d23a11cb496a69/63f8e9acf899f7545da43421_12%20benefits%20of%20employee%20training%20%26%20development.jpg",
    },
    {
      title: "Office Happy Hour",
      date: "Jun 28",
      location: "Office Lounge",
      description: "A casual gathering for employees to unwind after work.",
      image: "https://blog.thriver.com/wp-content/uploads/2022/01/blog_office-happy-hour-ideas-scaled.jpg",
    },
    {
      title: "Project Management Workshop",
      date: "Jul 8",
      location: "Project Management Office",
      description: "Workshop on effective project management techniques.",
      image: "https://mytechdecisions.com/wp-content/uploads/2018/09/Conference_Collaboration_Meeting.jpg",
    },
  ];

  return (
    <div className="mt-32">
      <div className="container mx-auto px-24">
        <h3 className="text-6xl font-heavy">Events</h3>
        <hr className="my-2"/>
      </div>
      <Carousel />
      <TimerCountdown />

      <div className="container mx-auto px-8 mt-10">
        
        {/* <h2 className="text-3xl font-light mb-4">Upcoming Events</h2>
        <hr className="mb-6"/>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingEvents.map((event, index) => (
            // <EventCard key={index} event={event} />
          ))}
        </div> */}

        <h2 className="text-3xl font-light mt-16 mb-4">Register Here</h2>
        <hr className="mb-6"/>
        <RSVPForm upcomingEvents={upcomingEvents} />

        {/* <h2 className="text-3xl font-light mt-16 mb-4">Past Events</h2>
        <hr className="mb-6"/>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {pastEvents.map((event, index) => (
            // <EventCard key={index} event={event} />
          ))}
        </div> */} */
       </div>
      
    </div>
  );
}

export default EventPage;
