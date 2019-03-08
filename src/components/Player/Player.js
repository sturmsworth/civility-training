import React from 'react'
import YouTube from 'react-youtube'

const opts = {
    height: '515px',
    width: '100%',
    playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0
    }
}

const Player = ({ currentMovie, startInterval, stopInterval, setCompleted }) => {
    return (
        <YouTube
            videoId={currentMovie}
            opts={opts}
            onPlay={startInterval}
            onPause={stopInterval}
            onStateChange={setCompleted}
        />
    )
}


export default Player;

// class Player extends Component {
//     constructor(props) {
//         super(props)
//         this.handleInterval = this.handleInterval.bind(this)
//     }

//     handleInterval()
//     render() {
//         // setIsPlaying is code that sets the state this.state.isPlaying in App.js 
//         // this.state.isPlaying is passed down from state as props into this component
//         

//         

//         const setState = (event) => {
//             const playerState = event.target.getPlayerState()
//             setIsPlaying(playerState)
//         }

//         
//             if(isPlaying === 1) {
//                 setInterval(getPercentage, 5000)
//                 if (getPercentage > 95) {
//                     clearInterval(getPercentage)
//                 }
//             }
//         }
        
//         return (
//             
//         )
//     }
// };

// export default Player;