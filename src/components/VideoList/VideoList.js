import React from 'react';
import Movie from '../Movies/Movie'


// const sortMovies = (movies) => {
//     const concatMovies = [].concat(movies)
//     const sortedMovies = orderBy(concatMovies, [ movie => movie.title ], [ 'asc' ])
//     return sortedMovies
// }

const videoListStyles = {
    height: '800px',
    overflowY: 'scroll'
}

const VideoList = ({ movies, setCurrentMovie, completedMovies, timeConverter, completedCheckmark, sortMovies }) => (
    <div style={videoListStyles}>
        { 
            sortMovies(movies).map((movie, index) => {
                return <Movie key={index} 
                            title={movie.title} 
                            durationYT={movie.durationYT} 
                            movieId={movie.id} 
                            setCurrentMovie={setCurrentMovie}
                            completedCheckmark={completedCheckmark}
                            completedMovies={completedMovies} 
                            timeConverter={timeConverter} 
                        />
            })
        }
    </div>
);

export default VideoList;