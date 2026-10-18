const lagosClock = document.querySelector('#lagos-clock');

if (lagosClock) {
  const lagosTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  const updateClock = () => {
    const now = new Date();
    const formattedTime = lagosTime.format(now);
    lagosClock.textContent = `${formattedTime} WAT`;
    lagosClock.dateTime = now.toISOString();
    lagosClock.setAttribute('aria-label', `Current Lagos time ${formattedTime} West Africa Time`);
    window.setTimeout(updateClock, 1000 - now.getMilliseconds());
  };

  updateClock();
}
