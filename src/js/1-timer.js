import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    const currentTime = new Date();

    if (userSelectedDate <= currentTime) {
      startBtn.disabled = true;
      iziToast.show({ message: 'Please choose a date in the future' });
      return;
    }

    startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

let timerId = null;

startBtn.addEventListener('click', () => {
  const currentTime = new Date();

  const difference = userSelectedDate - currentTime;

  waitTimer();

  timerId = setInterval(() => {
    const currentTime = new Date();
    const difference = userSelectedDate - currentTime;

    if (difference <= 0) {
      clearInterval(timerId);

      days.textContent = '00';
      hours.textContent = '00';
      minutes.textContent = '00';
      seconds.textContent = '00';

      input.disabled = false;

      return;
    }

    const time = convertMs(difference);

    days.textContent = String(time.days).padStart(2, '0');
    hours.textContent = String(time.hours).padStart(2, '0');
    minutes.textContent = String(time.minutes).padStart(2, '0');
    seconds.textContent = String(time.seconds).padStart(2, '0');
  }, 1000);
});

function waitTimer() {
  startBtn.disabled = true;
  input.disabled = true;
  return;
}
