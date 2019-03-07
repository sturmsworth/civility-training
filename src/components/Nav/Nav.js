import React from 'react'
import './Nav.css'

const Nav = ({ signedIn, signOut }) => (
    <div className="text-center" id="nav-target">
        <h1>Senate of Virginia: Civility Training</h1>
        <a href="https://apps.senate.virginia.gov/Portal/">
            <button className="btn btn-lg btn-outline-dark">Return to Portal</button>
        </a>
        { signedIn ? <button 
                        onClick={signOut}
                        id="sign-out"
                        className="btn btn-lg btn-outline-dark">
                            Sign Out
                    </button> 
                    : 
                    <div></div> 
        }
    </div>
);

export default Nav;