import React from 'react'
import YouTube from 'react-youtube'

const opts = {
    height: '800px',
    width: '100%',
    fs: 1,
    playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
    }
}

const hidePlayer = {
    height: '800px',
    width: '100%',
    backgroundColor: 'black',
    textAlign: 'center'
}

const hidePlayerButton = {
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingRight: '40px',
    paddingLeft: '40px'
}

const Player = ({ currentMovie, startInterval, stopInterval, setCompleted, playerState, movies, playNextSlide }) => {
    return (
        playerState !== 0 ? 
            <YouTube
                videoId={currentMovie}
                opts={opts}
                onPlay={startInterval}
                onPause={stopInterval}
                onStateChange={setCompleted}
            /> : 
            <div id="hide-player" style={hidePlayer}>
                <div className="row text-center h-100">
                    <div className="col-12 my-auto">
                        <button className="btn btn-lg btn-info" 
                                style={hidePlayerButton}
                                onClick={() => {
                                        playNextSlide(movies, currentMovie)
                                    }    
                                }
                            >
                            <i className="far fa-play-circle fa-10x"></i>
                            <h1>Next Slide</h1>
                        </button>
                    </div>
                </div>
            </div>
    )
}


export default Player;