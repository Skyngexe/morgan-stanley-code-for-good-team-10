import React from 'react';
import '../styles/view-events-and-feedbacks.module.css'

function Modal({event}) {

    function updateEvent(){
        const updatedEvent = {
            "ID" : event.ID,
            "Event Name" : document.getElementById('eventName').value,
            "Location" : document.getElementById('eventLocation').value,
            "Start Date" : document.getElementById('eventStartDate').value,
            "End Date" : document.getElementById('eventEndDate').value,
            "Event Type" : document.getElementById('eventType').value,
            "Status" : document.getElementById('status').value
        }
        console.log("Updated Event ", updatedEvent)

        /*Make API call to update event here*/
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Update Event</h2>
                <form>
                    <label htmlFor="eventName">Event Name:</label>
                    <input type="text" id="eventName" defaultValue={event.Name} /><br /><br />
                    <label htmlFor="eventLocation">Event Location:</label>
                    <input type="text" id="eventLocation" defaultValue={event.Location} /><br /><br />
                    <label htmlFor="eventStartDate">Start Date:</label>
                    <input type="text" id="eventStartDate" defaultValue={event["Start Date"]} /><br /><br />
                    <label htmlFor="eventEndDate">End Date:</label>
                    <input type="text" id="eventEndDate" defaultValue={event["End Date"]} /><br /><br />
                    <label htmlFor="eventType">Event Type:</label>
                    <input type="text" id="eventType" defaultValue={event["Event Type"]} /><br /><br />
                    <label htmlFor="status">Status: </label>
                    <input type="text" id="status" defaultValue={event["Status"]} /><br /><br />
                    <div className='button-container'><button onClick={updateEvent}>Update Event</button>
                    <button>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;