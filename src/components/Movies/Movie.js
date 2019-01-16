import React from 'react'

const Movie = ({ title, duration }) => {
    return (
        <div>
            <p>{title}</p>
            <p>{duration}</p>
        </div>
    )
};

export default Movie;