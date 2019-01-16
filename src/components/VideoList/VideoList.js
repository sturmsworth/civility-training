import React from 'react';
import Movie from '../Movies/Movie'
import './VideoList.css'

const VideoList = ({ movies }) => (
    <div>
        {
            movies.map((movie, index) => {
                return <Movie key={index} title={movie.title} duration={movie.duration} />
            })
        }
    </div>
);

export default VideoList;