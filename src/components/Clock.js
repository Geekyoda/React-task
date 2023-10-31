import React, { useState, useEffect } from 'react';
import './../style/Clock.css';

function Clock({ selectedCountry }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [clockRunning, setClockRunning] = useState(true);

    useEffect(() => {
        const updateClock = () => {
            if (clockRunning && selectedCountry && Array.isArray(selectedCountry) && selectedCountry.length > 0) {
                const timeZone = selectedCountry.join('/');
                fetch(`http://worldtimeapi.org/api/timezone/${timeZone}`)
                    .then((response) => response.json())
                    .then((timeData) => {
                        setCurrentTime(new Date(timeData.unixtime * 1000));
                    })
                    .catch((error) => {
                        console.error('Error fetching time data:', error);
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
            <p>{currentTime.toLocaleTimeString()}</p>
            <button onClick={handlePauseStartClock}>
                {clockRunning ? 'Pause' : 'Start'}
            </button>
        </div>
    );
}

export default Clock;
