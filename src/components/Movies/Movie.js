import React from 'react'
import './Movie.css'

const Movie = ({ title, durationYT, movieId, setCurrentMovie, completedMovies, timeConverter, completedCheckmark }) => {
    return (
        <div id={movieId}>
            <button className="btn btn-outline-light" onClick={() => setCurrentMovie(movieId)}>
                <span id="title">{title}</span>
                <span id="duration">
                    {timeConverter(durationYT)}
                </span>
                {
                    completedCheckmark(movieId) ?
                    <span id="checked">
                        <i className="far fa-check-circle"></i>
                    </span> :
                    <span id="not-checked">
                        <i className="far fa-circle"></i>
                    </span>
                }
                
            </button>
        </div>
    )
};

export default Movie