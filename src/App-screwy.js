// Components
import React, { Component } from "react";
import firebase from "./config/Firebase";
import Nav from "./components/Nav/Nav";
import SignIn from "./components/SignIn/SignIn";
import VideoList from "./components/VideoList/VideoList";
import Player from "./components/Player/Player";
import ClaimCertificate from "./components/ClaimCertificate/ClaimCertificate";
import PrintCertificate from "./components/PrintCertificate/PrintCertificate";
import Footer from "./components/Footer/Footer";

// configs
import YouTube from "./config/YouTube";

// CSS
import "./App.css";

// packages
import Moment from "moment";
import { orderBy } from "natural-orderby";

// here are some new comments about things that i didnt have before

const db = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      movieIds: [],
      playlist: "PLPiUbl1kNQEORn1p6bzu9umCYH7VAWum0",
      firstName: "",
      lastName: "",
      userEmail: "",
      userAccessDate: new Date(),
      completionDate: "",
      nextRequirement: null,
      userToken: "",
      completedMovies: [],
      courseCompleted: false,
      movies: [],
      currentMovie: "8FmuKZHgxQI",
      validCert: false,
      trackedPercentage: 0,
      intervalID: "",
      showModal: false,
      division: null,
      playerState: null,
      signOutMessage: null,
      timeOut: false,
      timeToLogout: 10,
      timeToLogoutID: ""
    };
    this.getPercentage = this.getPercentage.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.stopInterval = this.stopInterval.bind(this);
    this.setCompleted = this.setCompleted.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.youTubeTimeConverter = this.youTubeTimeConverter.bind(this);
    this.setCompletedCheckmark = this.setCompletedCheckmark.bind(this);
    this.setCertificate = this.setCertificate.bind(this);
    this.setModalState = this.setModalState.bind(this);
    this.checkEmailState = this.checkEmailState.bind(this);
  }

  signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        const token = result.credential.accessToken;
        const user = result.user;
        if (user && token) {
          this.setState({
            signedIn: true,
            firstName: user.Rb.displayName.split(" ")[0],
            lastName: user.Rb.displayName.split(" ")[1],
            userEmail: user.Rb.email,
            hd: user.Rb.email.split("@")[1],
            userAccessDate: Moment(new Date()).format("LLL"),
            userToken: token,
            signOutMessage: null
          });
        }
      })
      .then(() => {
        db.collection("users")
          .doc(this.state.userEmail)
          .get()
          .then(doc => {
            doc.exists
              ? db
                  .collection("users")
                  .doc(this.state.userEmail)
                  .update({
                    userAccessDate: Moment(new Date()).format("LLL")
                  })
                  .then(() => {
                    this.setState({
                      firstName: doc.data().firstName,
                      lastName: doc.data().lastName,
                      userEmail: doc.data().userEmail,
                      userToken: doc.data().userToken,
                      completedMovies: doc.data().completedMovies,
                      courseCompleted: doc.data().courseCompleted,
                      currentMovie: doc.data().currentMovie,
                      validCert: doc.data().validCert,
                      completionDate: doc.data().completionDate,
                      nextRequirement: doc.data().nextRequirement,
                      hd: doc.data().hd,
                      signOutMessage: null
                    });
                  })
              : db
                  .collection("users")
                  .doc(this.state.userEmail)
                  .set({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    userEmail: this.state.userEmail,
                    userAccessDate: Moment(new Date()).format("LLL"),
                    userToken: this.state.userToken,
                    completedMovies: [],
                    courseCompleted: false,
                    currentMovie: "8FmuKZHgxQI",
                    validCert: false,
                    nextRequirement: null,
                    hd: this.state.hd
                  })
                  .then(() => {
                    db.collection("users")
                      .doc(this.state.userEmail)
                      .get()
                      .then(doc => {
                        this.setState({
                          firstName: doc.data().firstName,
                          lastName: doc.data().lastName,
                          userEmail: doc.data().userEmail,
                          userAccessDate: Moment(new Date()).format("LLL"),
                          userToken: doc.data().userToken,
                          completedMovies: doc.data().completedMovies,
                          courseCompleted: doc.data().courseCompleted,
                          currentMovie: doc.data().currentMovie,
                          validCert: doc.data().validCert,
                          nextRequirement: doc.data().nextRequirement,
                          hd: doc.data().hd,
                          signOutMessage: null
                        });
                      })
                      .catch(err =>
                        console.log("Error with retrieval after save: ", err)
                      );
                  })
                  .catch(error =>
                    console.log("Error adding document: ", error)
                  );
          })
          .then(() => {
            this.checkEmailState();
          })
          .catch(error => console.log("Error with ternary: ", error));
      })
      .catch(error => {
        console.log(
          "Error with call to Firestore: " + error.code,
          error.message
        );
      });
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.stopInterval();
        this.setState({
          signedIn: false,
          currentMovie: null,
          firstName: null,
          lastName: null,
          userEmail: null,
          userAccessDate: null,
          userToken: null,
          completedMovies: [],
          courseCompleted: false,
          validCert: false,
          trackedPercentage: null,
          intervalID: null,
          nextRequirement: null,
          completionDate: null,
          hd: null,
          signOutMessage: null
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getPercentage(event) {
    const position = event.target.getCurrentTime();
    const duration = event.target.getDuration();
    const percent = Math.round((position / duration) * 100);
    this.setState({
      trackedPercentage: percent
    });
  }

  youTubeTimeConverter(time) {
    var match = time.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    // eslint-disable-next-line
    match = match.slice(1).map(x => {
      if (x != null) {
        return x.replace(/\D/, "");
      }
    });

    var hours = parseInt(match[0]) || 0;
    var minutes = parseInt(match[1]) || 0;
    var seconds = parseInt(match[2]) || 0;
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;

    const convertIntoMinutes = timeInSeconds => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds - minutes * 60;

      const str_pad_left = (string, pad, length) => {
        return (new Array(length + 1).join(pad) + string).slice(-length);
      };

      var finalTime =
        str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);
      return finalTime;
    };

    return convertIntoMinutes(timeInSeconds);
  }

  setCompleted(event) {
    const completeTracker = event.target.getPlayerState();
    const completedMovie = {
      id: this.state.currentMovie,
      percent: this.state.trackedPercentage,
      complete: false
    };

    if (completeTracker === 0) {
      this.setState({
        playerState: completeTracker
      });
      completedMovie.complete = true;
      const completedMovies = this.state.completedMovies;
      const filteredMovies = completedMovies.filter(
        movie => movie.id === completedMovie.id
      );
      const result = filteredMovies.length;
      if (result === 0) {
        this.setState(prevState => ({
          completedMovies: [...prevState.completedMovies, completedMovie]
        }));

        db.collection("users")
          .doc(this.state.userEmail)
          .update({
            completedMovies: this.state.completedMovies
          })
          .then(() => {
            this.setCertificate();
            this.stopInterval();
            console.log("Completed Film added to DB");
          })
          .catch(err =>
            console.log("Error updating completedMovies array: ", err)
          );
      }
    } else {
      this.setState({
        playerState: completeTracker
      });
    }
  }

  setCompletedCheckmark(movieID) {
    const completedMovies = this.state.completedMovies;
    return completedMovies.some(item => movieID === item.id);
  }

  startInterval(event) {
    const intervalID = setInterval(() => this.getPercentage(event), 1000);
    this.setState({
      intervalID
    });
  }

  stopInterval() {
    this.setState({
      intervalID: clearInterval(this.state.intervalID)
    });
  }

  trackYouTubeOnStateChange(event) {}

  setCurrentMovie = id => {
    this.setState({
      currentMovie: id,
      trackedPercentage: 0,
      playerState: null
    });

    db.collection("users")
      .doc(this.state.userEmail)
      .update({
        currentMovie: this.state.currentMovie
      })
      .then(() => {
        console.log("Current Movie Updated");
      })
      .catch(err => console.log("Error updating currentMovie: ", err));
  };

  setCertificate() {
    if (this.state.completedMovies.length === 35) {
      this.setState({
        validCert: true,
        completionDate: Moment(new Date()).format("LLL"),
        nextRequirement: Moment(new Date())
          .add(2, "y")
          .format("LLL"),
        courseCompleted: true
      });

      db.collection("users")
        .doc(this.state.userEmail)
        .update({
          validCert: this.state.validCert,
          completionDate: this.state.completionDate,
          courseCompleted: this.state.courseCompleted,
          nextRequirement: this.state.nextRequirement,
          certInfo: {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            hd: this.state.hd,
            completionDate: this.state.completionDate,
            userToken: this.state.userToken
          }
        })
        .then(() => {
          console.log("Certifcation Validation/Completion Date Updated");
        })
        .catch(err =>
          console.log("Error updating Validation/Completion Date: ", err)
        );
    }
  }

  setModalState() {
    !this.state.showModal
      ? this.setState({
          showModal: true
        })
      : this.setState({
          showModal: false
        });
  }

  checkEmailState() {
    const emailString = this.state.userEmail.toLowerCase();
    console.log(emailString);
    if (emailString.includes("senate.virginia.gov")) {
      this.setState({
        division: `Senate of Virginia`
      });
      console.log("Welcome Senate of Virginia Member!");
    } else if (emailString.includes("dlas.virginia.gov")) {
      this.setState({
        division: `Division of Legislative Automated Systems`
      });
      console.log("Welcome Division of Legislative Automated Systems Member!");
    } else if (emailString.includes("dcp.virginia.gov")) {
      this.setState({
        division: `Division of Capitol Police`
      });
      console.log("Welcome Division of Capitol Police Member!");
    } else if (emailString.includes("dls.virginia.gov")) {
      this.setState({
        division: `Division of Legislative Services`
      });
      console.log("Welcome Division of Legislative Services Member!");
    } else if (emailString.includes("hac.virginia.gov")) {
      this.setState({
        division: `House Appropriations Committee`
      });
      console.log("Welcome House Appropriations Committee Member!");
    } else if (emailString.includes("jchc.virginia.gov")) {
      this.setState({
        division: `Joint Commission on Health Care`
      });
      console.log("Welcome Joint Commission on Health Care Member!");
    } else if (emailString.includes("jlarc.virginia.gov")) {
      this.setState({
        division: `Joint Legislative Audit and Review Commission`
      });
      console.log(
        "Welcome Joint Legislative Audit and Review Commission Member!"
      );
    } else if (emailString.includes("mirc.virginia.gov")) {
      this.setState({
        division: `Medicaid Innovation and Reform Commission`
      });
      console.log("Welcome Medicaid Innovation and Reform Commission Member!");
    } else if (emailString.includes("sfc.virginia.gov")) {
      this.setState({
        division: `Senate Finance Committee`
      });
      console.log("Welcome Senate Finance Committee Member!");
    } else if (emailString.includes("vscc.virginia.gov")) {
      this.setState({
        division: `Virginia State Crime Commission`
      });
      console.log("Welcome Virginia State Crime Commission Member!");
    } else {
      this.setState({
        division: null
      });
      console.log("Error, no matching email found!");
    }
  }

  sortMovies = movies => {
    const concatMovies = [].concat(movies);
    const sortedMovies = orderBy(concatMovies, [movie => movie.title], ["asc"]);
    return sortedMovies;
  };

  playNextSlide = (movies, currentMovie) => {
    this.setState({
      playerState: null
    });
    this.stopInterval();
    const sortedMovies = this.sortMovies(movies);
    const indexOfSortedMovies = sortedMovies.findIndex(
      movie => movie.id === currentMovie
    );
    const nextMovie = indexOfSortedMovies + 1;
    if (sortedMovies[nextMovie] === undefined) {
      alert("The course is complete. Please collect your certificate below.");
      this.setState({
        currentMovie: ""
      });
    } else {
      this.setCurrentMovie(sortedMovies[nextMovie].id);
    }
  };

  componentDidMount() {
    const playlist = this.state.playlist;
    const URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlist}&key=${YouTube.youtube}`;
    fetch(URL)
      .then(response => response.json())
      .then(response2 =>
        response2.items.forEach(item =>
          this.setState(prevState => ({
            movieIds: [...prevState.movieIds, item.contentDetails.videoId]
          }))
        )
      )
      .then(() => {
        const movieIds = this.state.movieIds;
        movieIds.forEach(id => {
          const URL2 = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${YouTube.youtube}&part=snippet,contentDetails`;
          fetch(URL2)
            .then(response => response.json())
            .then(response2 => {
              const title = response2.items[0].snippet.localized.title;
              const durationYT = response2.items[0].contentDetails.duration;
              const id = response2.items[0].id;
              const link = `https://www.youtube.com/watch?v=${id}`;
              const youTubeInfo = {
                title,
                durationYT,
                link,
                id
              };
              this.setState(prevState => ({
                movies: [...prevState.movies, youTubeInfo]
              }));
            })
            .catch(err => console.log(err));
        });
      })
      .catch(err => console.log(err));

    const resetTimer = () => {
      this.setState({
        timeToLogout: 10
      });
    };

    window.onload = () => resetTimer();
    document.onmousemove = () => resetTimer();
    document.onkeypress = () => resetTimer();
    document.onclick = () => resetTimer();
  }

  componentWillUpdate() {
    const logoutOnInactive = () => {
      const timeTracker = () => {
        this.setState(prevState => ({
          timeToLogout: prevState.timeToLogout - 1
        }));
      };

      const setTimerInterval = () => {
        this.setState({
          timeToLogoutID: setInterval(() => timeTracker(), 1000)
        });
      };

      const clearTimerInterval = () => {
        this.setState({
          timeToLogoutID: clearInterval(this.state.timeToLogoutID)
        });
      };

      if (this.state.signedIn === true) {
        setTimerInterval();
      }

      if (this.state.timeToLogout === 0) {
        clearTimerInterval();
      }
    };

    logoutOnInactive();
  }

  render() {
    const {
      signedIn,
      signOutMessage,
      movies,
      currentMovie,
      completedMovies,
      validCert,
      firstName,
      lastName,
      completionDate,
      userToken,
      division,
      playerState
    } = this.state;
    return (
      <div className="App container-fluid">
        <section>
          <div className="row">
            <div className="col-12">
              <Nav signedIn={signedIn} signOut={this.signOut} />
            </div>
          </div>
        </section>

        {!this.state.signedIn ? (
          <section id="signin-section">
            <div className="row text-center h-100">
              <div className="col-12 my-auto">
                <SignIn signIn={this.signIn} signOutMessage={signOutMessage} />
              </div>
            </div>
          </section>
        ) : (
          <div>
            <section id="player-section">
              <div className="row">
                <div className="col-3">
                  <VideoList
                    movies={movies}
                    completedMovies={completedMovies}
                    setCurrentMovie={this.setCurrentMovie}
                    timeConverter={this.youTubeTimeConverter}
                    completedCheckmark={this.setCompletedCheckmark}
                    sortMovies={this.sortMovies}
                  />
                </div>
                <div className="col-9">
                  <Player
                    currentMovie={currentMovie}
                    stopInterval={this.stopInterval}
                    startInterval={this.startInterval}
                    setCompleted={this.setCompleted}
                    playerState={playerState}
                    movies={movies}
                    playNextSlide={this.playNextSlide}
                  />
                </div>
              </div>
            </section>

            <section id="cert-section">
              <div className="row">
                <div className="col-12">
                  <ClaimCertificate
                    validCert={validCert}
                    setModalState={this.setModalState}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        <section id="footer-section">
          <div className="row text-center">
            <div className="col-12">
              <Footer />
            </div>
          </div>
        </section>

        {this.state.showModal ? (
          <section
            id="print-section"
            onClick={() => {
              this.setModalState();
            }}
          >
            <div className="row">
              <div className="col-12">
                <PrintCertificate
                  firstName={firstName}
                  lastName={lastName}
                  completionDate={completionDate}
                  certID={userToken}
                  division={division}
                />
              </div>
            </div>
          </section>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default App;
