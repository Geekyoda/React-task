import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserCard from './components/UserCard';
import UserProfile from './components/UserProfile';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loading ? (
              <div>Loading...</div>
            ) : (
              <div className="user-directory">
                <h1>Directory</h1>
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )
          }
        />
        <Route path="/user/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
