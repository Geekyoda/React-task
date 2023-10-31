import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Clock from './Clock';

import './../style/UserProfile.css'; 




function UserProfile() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [selectedCountry, setSelectedCountry] = useState([]);
    const [clockRunning, setClockRunning] = useState(true);
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState(null);
    const [showPostPopup, setShowPostPopup] = useState(false);
    const [selectedPost, setSelectedPost] = useState('');

    const handleOpenPostPopup = (post) => {
        setSelectedPost(post);
        setShowPostPopup(true);
    };

    const handleClosePostPopup = () => {
        setShowPostPopup(false);
        setSelectedPost('');
    };



    useEffect(() => {
        const userUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;

        fetch(userUrl)
            .then((response) => response.json())
            .then((userData) => {
                setUser(userData);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                setUser(null); // Clear user data on error
                setError('Failed to fetch user data. Please try again.'); 
            });
    }, [userId]);

    useEffect(() => {
        // Fetch the list of countries
        fetch('http://worldtimeapi.org/api/timezone')
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map((timezone) => timezone.split('/'));
                setCountries(countries);
                setSelectedCountry(countries[0]);
            })
            .catch((error) => {
                console.error('Error fetching countries:', error);
            });
    }, []);


    useEffect(() => {
        const updateClock = () => {
            if (clockRunning && selectedCountry) {
                const [area, location, region] = selectedCountry;
                const timezoneUrl = `http://worldtimeapi.org/api/timezone/${area}/${location}/${region || ''}`;

                fetch(timezoneUrl)
                    .then((response) => response.json())
                    .then((timeData) => {
                        setCurrentTime(timeData.utc_datetime);
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
    }, [clockRunning, selectedCountry]); // Ensure selectedCountry is included here







    const handleToggleClockAndFetchTime = (country) => {
        setSelectedCountry(country.split('/'));
        setClockRunning(true);
    };

    const handleToggleClock = () => {
        setClockRunning(!clockRunning);
    };
    return (
        <div className="user-profile">
            <div className="Head">
                <Link to="/">
                    <button className='Back'>Back</button>
                </Link>

                <div className="time-controls">

                    <h3>Country Dropdown</h3>
                    <select
                        value={selectedCountry.join('/')}
                        onChange={(e) => handleToggleClockAndFetchTime(e.target.value)}
                    >
                        {countries.map((country, index) => (
                            <option key={index} value={country.join('/')}>
                                {country.join(' / ')}
                            </option>
                        ))}
                    </select>

                </div>
                <Clock selectedCountry={selectedCountry} />
            </div>
            {user && (
                <div className="user-details">
                    <h2>My Profile</h2>
                    <div className="user-box">
                        <div className="left-section">
                            <h3>Name: {user.name}</h3>
                            <p>Username: {user.username}</p>
                            <p>Catch Phrase: {user.company.catchPhrase}</p>
                        </div>
                        <div className="right-section">
                            <p>
                                Address: {user.address.street}, {user.address.suite}, {user.address.city}
                            </p>
                            <p>Email: {user.email}</p>
                            <p>Phone: {user.phone}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="user-posts">
                <div className="Post">
                    <h2>My Posts</h2>
                    {user && user.posts ? (
                        user.posts.map((post, index) => (
                            <div key={index} className="post">
                                <h3>{post.title}</h3>
                                <p>{post.body}</p>
                            </div>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}


                </div>
                {showPostPopup && (
                    <div className="post-popup">
                        <div className="popup-content">
                            <span className="close-button" onClick={handleClosePostPopup}>
                                &times;
                            </span>
                            <h2>Post Content</h2>
                            <p>{selectedPost.body}</p>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default UserProfile;
