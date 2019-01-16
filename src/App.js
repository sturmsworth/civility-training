import React, { Component } from 'react';
import Nav from './components/Nav/Nav'
import SignIn from './components/SignIn/SignIn';
import VideoList from './components/VideoList/VideoList'
import Player from './components/Player/Player'
import ClaimCertificate from './components/ClaimCertificate/ClaimCertificate';
import './App.css';
import Keys from './config/Keys'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      movieIds: [
        '7maJOI3QMu0',
        'CvFH_6DNRCY',
        'uT3SBzmDxGk',
        'GjbSqDgh1B4',
        '9E6b3swbnWg'
      ],
      movies: [],
      currentMovie: '',
      completedMovies: {},
      validCert: false
    }
  }
  
  componentDidMount() {
    const movieIds = this.state.movieIds
    movieIds.forEach((id) => {
      const URL = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${Keys.youtube}&part=snippet,contentDetails`
      fetch(URL)
      .then(response => response.json())
      .then(response2 => {
        const title = response2.items[0].snippet.localized.title
        const duration = response2.items[0].contentDetails.duration
        const id = response2.items[0].id
        const link = `https://www.youtube.com/watch?v=${id}`
        const youTubeInfo = {
          title,
          duration,
          link
        }
        this.setState(prevState => ({
          movies: [...prevState.movies, youTubeInfo]
        }))
      })
      .catch(err => console.log(err))
    })
  }

  render() {
    const { signedIn, movies, currentMovie, completedMovies, validCert } = this.state
    return (
      <div className="App container-fluid">
        <div className="container">

          <div className="row">
            <div className="col-12">
              <Nav />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <SignIn signedIn={signedIn} />
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              <VideoList movies={movies} completedMovies={completedMovies}/>
            </div>
            <div className="col-8">
              <Player currentMovie={currentMovie} />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <ClaimCertificate validCert={validCert} />
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
