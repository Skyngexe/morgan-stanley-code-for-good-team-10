function TimerLogic(eventDate) {
    const endDay = new Date()
    endDay.setDate(endDay.getDate() + 9)

    const currentDayTime = new Date().getTime(); // Get the current time each time the function is called
    const endDayTime = new Date(eventDate).getTime(); // Convert the provided event date to a time in milliseconds

    const totalRemaining = endDayTime - currentDayTime;

    if (totalRemaining <= 0) {
        return false; // If the event time has passed, return false
    }

    const days = Math.floor(totalRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((totalRemaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((totalRemaining / (1000 * 60)) % 60);
    const seconds = Math.floor((totalRemaining / 1000) % 60);

    return [days, hours, minutes, seconds];
}

export default TimerLogic;
