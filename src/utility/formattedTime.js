import moment from 'moment';


// Format the time to include AM/PM using toLocaleTimeString
export const formattedTime = (time) => {
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, // Set to true to include AM/PM
  });
};


export const getTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Function to format the date-time string
export const formatDateTime = (dateTimeString, type) => {
  // const date = new Date(dateTimeString);
  // let hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();
  // const ampm = hours >= 12 ? 'PM' : 'AM';

  // hours = hours % 12;
  // hours = hours ? hours : 12; // the hour '0' should be '12'
  // const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  // const strSeconds = seconds < 10 ? '0' + seconds : seconds;

  // const formattedTime = `${hours}:${strMinutes}:${strSeconds} ${ampm}`;
  const date = new Date(dateTimeString);
  const formattedTime = type == 'time' ? moment(date).format('hh:mm A') : moment(date).format('YYYY-MM-DD');
  return formattedTime;
}

// Convert time string to Date object
export const convertToDateTime = (timeString) => {
  // Split time string into hours, minutes, and am/pm
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':');

  // Convert hours to 24-hour format if it's PM
  let hour = parseInt(hours, 10);
  if (period === 'PM' || period === 'pm') {
    hour += 12;
  }

  // Create Date object with the specified time
  const dateTime = new Date();
  dateTime.setHours(hour);
  dateTime.setMinutes(parseInt(minutes, 10));
  dateTime.setSeconds(0);

  return dateTime;
};