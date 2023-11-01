import React, { useState, useEffect } from 'react';
import './../style/Clock.css';

function Clock({ selectedCountry }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [clockRunning, setClockRunning] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const updateClock = () => {
            if (clockRunning && selectedCountry && Array.isArray(selectedCountry) && selectedCountry.length > 0) {
                const timeZone = selectedCountry.join('/');
                console.log('Current Time Zone:', timeZone); // For debugging
                fetch(`http://worldtimeapi.org/api/timezone/${timeZone}`)
                    .then((response) => response.json())
                    .then((timeData) => {
                        console.log('Fetched Time Data:', timeData); // For debugging
                        setCurrentTime(new Date(timeData.unixtime * 1000));
                    })
                    .catch((error) => {
                        console.error('Error fetching time data:', error);
                        setError('Failed to fetch time data. Please try again.');
                    });
            }
        };

        const interval = setInterval(updateClock, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [clockRunning, selectedCountry]);

    const handlePauseStartClock = () => {
        setClockRunning(!clockRunning);
    };
    return (
        <div className="clock">
            {error && <p className="error-message">{error}</p>} {/* Display error message if error state is set */}
            <p>{currentTime.toLocaleTimeString()}</p>
            <button onClick={handlePauseStartClock}>
                {clockRunning ? 'Pause' : 'Start'}
            </button>
        </div>
    );
}

export default Clock;
