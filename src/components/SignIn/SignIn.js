import React from "react";

const SignIn = ({ signIn, signOutMessage }) => (
  <div id="sign-in">
    {signOutMessage ? <h3 className="text-danger">{signOutMessage}</h3> : null}
    <h1>Please sign in to get started.</h1>
    <button className="btn btn-lg btn-success" onClick={() => signIn()}>
      Sign In
    </button>
    <h5>
      This Application only supports{" "}
      <a href="https://www.google.com/chrome/">Google Chrome</a> and{" "}
      <a href="https://www.mozilla.org/en-US/firefox/new/">Mozilla Firefox</a>
    </h5>
  </div>
);

export default SignIn;
