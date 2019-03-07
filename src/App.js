// Components
import React, { Component } from 'react'
import firebase from './config/Firebase'
import Nav from './components/Nav/Nav'
import SignIn from './components/SignIn/SignIn'
import VideoList from './components/VideoList/VideoList'
import Player from './components/Player/Player'
import ClaimCertificate from './components/ClaimCertificate/ClaimCertificate'
import PrintCertificate from './components/PrintCertificate/PrintCertificate'
import Footer from './components/Footer/Footer'

// configs
import YouTube from './config/YouTube'

// CSS
import './App.css'

// packages
import Moment from 'moment'

// here are some new comments about things that i didnt have before

const db = firebase.firestore()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      movieIds: [],
      playlist: 'PLPiUbl1kNQEORn1p6bzu9umCYH7VAWum0',
      userName: '',
      userEmail: '',
      userAccessDate: new Date(),
      completionDate: '',
      userToken: '',
      completedMovies: [],
      courseCompleted: false,
      movies: [],
      currentMovie: '8FmuKZHgxQI',
      validCert: false,
      trackedPercentage: 0,
      intervalID: '',
      showModal: false
    }
    this.getPercentage = this.getPercentage.bind(this)
    this.startInterval = this.startInterval.bind(this)
    this.stopInterval = this.stopInterval.bind(this)
    this.setCompleted = this.setCompleted.bind(this)
    this.signIn = this.signIn.bind(this)
    this.signOut = this.signOut.bind(this)
    this.youTubeTimeConverter = this.youTubeTimeConverter.bind(this)
    this.setCompletedCheckmark = this.setCompletedCheckmark.bind(this)
    this.setCertificate = this.setCertificate.bind(this)
    this.setModalState = this.setModalState.bind(this)
  }

  signIn() {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        const token = result.credential.accessToken
        const user = result.user
        if (user && token) {
          this.setState({
            signedIn: true,
            userName: user.Rb.displayName,
            userEmail: user.Rb.email,
            userAccessDate: Moment(new Date()).format('YYYY-MM-DD HH:mm'),
            userToken: token,
          })
        }
      })
      .then(() => {
        db.collection('users').doc(this.state.userEmail).get()
          .then(doc => {
            doc.exists ? 
            this.setState({
              userName: doc.data().userName,
              userEmail: doc.data().userEmail,
              userToken: doc.data().userToken,
              completedMovies: doc.data().completedMovies,
              courseCompleted: doc.data().courseCompleted,
              currentMovie: doc.data().currentMovie,
              validCert: doc.data().validCert,
              completionDate: doc.data().completionDate
            }) : 
            db.collection('users').doc(this.state.userEmail).set({
              userName: this.state.userName,
              userEmail: this.state.userEmail,
              userAccessDate: Moment(new Date()).format('YYYY-MM-DD HH:mm'),
              userToken: this.state.userToken,
              completedMovies: [],
              courseCompleted: false,
              currentMovie: '7maJOI3QMu0',
              validCert: false,
            })
            .then(() => {
              db.collection('users').doc(this.state.userEmail).get()
                .then(doc => {
                  this.setState({
                    userName: doc.data().userName,
                    userEmail: doc.data().userEmail,
                    userAccessDate: new Date(),
                    userToken: doc.data().userToken,
                    completedMovies: doc.data().completedMovies,
                    courseCompleted: doc.data().courseCompleted,
                    currentMovie: doc.data().currentMovie,
                    validCert: doc.data().validCert,
                  })
                })
                .catch(err => console.log('Error with retrieval after save: ', err))
            })
            .catch(error =>  console.log("Error adding document: ", error))
          })
          .catch(error => console.log("Error with ternary: ", error))
      })
      .catch((error) => {
        console.log('Error with call to Firestore: ' + error.code, error.message)
      })
  }

  signOut() {
    firebase.auth().signOut()
      .then(() => {
        this.setState({
          signedIn: false,
          currentMovie: null,
          userName: null,
          userEmail: null,
          userAccessDate: null,
          userToken: null,
          completedMovies: [],
          courseCompleted: false,
          validCert: false,
          trackedPercentage: null,
          intervalID: null
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getPercentage(event) {
    const position = event.target.getCurrentTime()
    const duration = event.target.getDuration()
    const percent = Math.round((position / duration) * 100)
    this.setState({
      trackedPercentage: percent
    })
  }

  youTubeTimeConverter(time) {
    var match = time.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

    match = match.slice(1).map(x => {
      if (x != null) {
          return x.replace(/\D/, '')
      }
    })

    var hours = (parseInt(match[0]) || 0)
    var minutes = (parseInt(match[1]) || 0)
    var seconds = (parseInt(match[2]) || 0)
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds

    const convertIntoMinutes = (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60)
      const seconds = timeInSeconds - minutes * 60
      
      const str_pad_left = (string, pad, length) => {
        return (new Array(length + 1).join(pad) + string).slice( - length);
      }
      
      var finalTime = str_pad_left(minutes, '0', 2)+':'+str_pad_left(seconds, '0', 2);
      return finalTime
    }

    return convertIntoMinutes(timeInSeconds)
  }

  setCompleted(event) {
    const completeTracker = event.target.getPlayerState()
    const completedMovie = {
      id: this.state.currentMovie,
      percent: this.state.trackedPercentage,
      complete: false
    }

    if (completeTracker === 0) {
      completedMovie.complete = true
      const completedMovies = this.state.completedMovies
      const filteredMovies = completedMovies.filter(movie => movie.id === completedMovie.id)
      const result = filteredMovies.length
      if (result === 0) {
        this.setState(prevState => ({
          completedMovies: [...prevState.completedMovies, completedMovie]
        }))

        db.collection('users').doc(this.state.userEmail).update({
          completedMovies: this.state.completedMovies
        })
          .then(() => {
            this.setCertificate()
            console.log("Completed Film added to DB")
          })
          .catch(err => console.log("Error updating completedMovies array: ", err))
      }
    }
  }

  setCompletedCheckmark(movieID) {
    const completedMovies = this.state.completedMovies
    return completedMovies.some(item => movieID === item.id)
  }

  startInterval(event) {
    const intervalID = setInterval(() => this.getPercentage(event), 1000)
    this.setState({
      intervalID,
    })
  }

  stopInterval() {
    this.setState({
      intervalID: clearInterval(this.state.intervalID)
    })
  }

  setCurrentMovie = (id) => {
    this.setState({ currentMovie: id })

    db.collection('users').doc(this.state.userEmail).update({
      currentMovie: this.state.currentMovie
    })
      .then(() => {
        console.log("Current Movie Updated")
      })
      .catch(err => console.log("Error updating currentMovie: ", err))
  }

  setCertificate() {
    console.log(`this is setCertificate running: `, this.state.completedMovies.length)
    if (this.state.completedMovies.length === 35) {
      this.setState({
        validCert: true,
        completionDate: Moment(new Date()).format('MMMM-Do-YYYY'),
        courseCompleted: true
      })

      db.collection('users').doc(this.state.userEmail).update({
        validCert: this.state.validCert,
        completionDate: this.state.completionDate,
        courseCompleted: this.state.courseCompleted

      })
        .then(() => {
          console.log("Certifcation Validation/Completion Date Updated")
        })
        .catch(err => console.log("Error updating Validation/Completion Date: ", err))
    }
  }

  setModalState() {
    !this.state.showModal ? this.setState({
      showModal: true
    }) :
    this.setState({
      showModal: false
    })
  }

  componentDidMount() {
    const playlist = this.state.playlist
    const URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlist}&key=${YouTube.youtube}`
    fetch(URL)
      .then(response => response.json())
      .then(response2 => response2.items.forEach((item) => this.setState(prevState => ({
        movieIds: [...prevState.movieIds, item.contentDetails.videoId]
      }))))
      .then(() => {
        const movieIds = this.state.movieIds
        movieIds.forEach((id) => {
          const URL2 = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${YouTube.youtube}&part=snippet,contentDetails`
          fetch(URL2)
          .then(response => response.json())
          .then(response2 => {
            const title = response2.items[0].snippet.localized.title
            const durationYT = response2.items[0].contentDetails.duration
            const id = response2.items[0].id
            const link = `https://www.youtube.com/watch?v=${id}`
            const youTubeInfo = {
              title,
              durationYT,
              link,
              id
            }
            this.setState(prevState => ({
              movies: [...prevState.movies, youTubeInfo]
            }))
          })
          .catch(err => console.log(err))
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    const { signedIn, movies, currentMovie, completedMovies, validCert, userName, completionDate } = this.state
    return (
      <div className="App container-fluid">
        <div className="container">

        <section>
          <div className="row">
            <div className="col-12">
              <Nav signedIn={signedIn} signOut={this.signOut} />
            </div>
          </div>
        </section>
        
          { !this.state.signedIn ? 
              <section id="signin-section">
                <div className="row text-center h-100">
                  <div className="col-12 my-auto">
                    <SignIn signIn={this.signIn} />
                  </div>
                </div>
              </section>
            : 
            <div>
              <section id="player-section">
                <div className="row">
                  <div className="col-4">
                    <VideoList 
                      movies={movies} 
                      completedMovies={completedMovies} 
                      setCurrentMovie={this.setCurrentMovie}
                      timeConverter={this.youTubeTimeConverter}
                      completedCheckmark={this.setCompletedCheckmark}
                    />
                  </div>
                  <div className="col-8">
                    <Player 
                      currentMovie={currentMovie}
                      stopInterval={this.stopInterval}
                      startInterval={this.startInterval}
                      setCompleted={this.setCompleted}
                    />
                  </div>
                </div>
              </section>
              
              <section id="cert-section">
                <div className="row">
                  <div className="col-12">
                    <ClaimCertificate validCert={validCert} setModalState={this.setModalState}/>
                  </div>
                </div>
              </section>
              
            </div>
          }

          <section id="footer-section">
            <div className="row text-center">
              <div className="col-12">
                <Footer />
              </div>
            </div>
          </section>

          {
            this.state.showModal ? 
            <section id="print-section" onClick={() => {this.setModalState()}}>
              <div className="row">
                <div className="col-12">
                  <PrintCertificate userName={userName} completionDate={completionDate} />
                </div>
              </div>
            </section> : 
            <div></div>
          }
          
        </div>
      </div>
    );
  }
}

export default App;
