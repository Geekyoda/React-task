import React from 'react';
import { Link } from 'react-router-dom';
import './../style/UserCard.css';

function UserCard({ user }) {
    return (
        <div className="user-card">
            <Link to={`/user/${user.id}`}>
                <div className="user-info">
                    <h2>{user.name}</h2>
                    <p>Total Posts: {user.posts ? user.posts.length : 0}</p>
                </div>
            </Link>
        </div>
    );
}

export default UserCard;
