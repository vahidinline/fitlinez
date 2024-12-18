import convertToPersianNumbers from './PersianNumber';

const formatTime = (totalSeconds, RTL) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${convertToPersianNumbers(
    formattedHours,
    RTL
  )}:${convertToPersianNumbers(
    formattedMinutes,
    RTL
  )}:${convertToPersianNumbers(formattedSeconds, RTL)}`;
};

export default formatTime;
