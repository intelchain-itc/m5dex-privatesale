import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const getTimeParts = (target) => {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
};

const Countdown = ({ endsAt }) => {
  const [time, setTime] = useState(() => getTimeParts(new Date(endsAt)));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeParts(new Date(endsAt)));
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return (
    <div className="countdown">
      <div>
        <strong>{time.days}</strong>
        <span>Days</span>
      </div>
      <div>
        <strong>{time.hours}</strong>
        <span>Hours</span>
      </div>
      <div>
        <strong>{time.minutes}</strong>
        <span>Minutes</span>
      </div>
      <div>
        <strong>{time.seconds}</strong>
        <span>Seconds</span>
      </div>
    </div>
  );
};

Countdown.propTypes = {
  endsAt: PropTypes.string.isRequired,
};

export default Countdown;
