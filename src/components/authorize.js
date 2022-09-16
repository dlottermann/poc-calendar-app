import React, { useEffect, useRef, useState } from "react";
import { gapi } from "gapi-script";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const scope =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

const handleAuthClick = () => {
  gapi.auth2.getAuthInstance().signIn();
};

const handleSignoutClick = () => {
  gapi.auth2.getAuthInstance().signOut();
};

const handleRevokeClick = () => {
  gapi.auth2.getAuthInstance().disconnect();
};

const Authorize = () => {
  const GoogleAuth = useRef(undefined);

  const [isSignedIn, setIsSignedIn] = useState(null);

  function setSigninStatus() {
    const user = GoogleAuth.current.currentUser.get();
    const isAuthorized = user.hasGrantedScopes(scope);
    if (isAuthorized) {
      sessionStorage.setItem(
        "d.access_token",
        user.getAuthResponse().access_token
      );
      setIsSignedIn(isAuthorized);
    } else {
      sessionStorage.removeItem("d.access_token");
      setIsSignedIn(isAuthorized);
    }
  }

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey,
          clientId,
          scope,
        })
        .then(() => {
          GoogleAuth.current = gapi.auth2.getAuthInstance();

          // Listen for sign-in state changes.
          GoogleAuth.current.isSignedIn.listen(setSigninStatus);
          setSigninStatus();
        });
    });
  }, []);

  return (
    <>
      <p>Calendar API.</p>

      {isSignedIn ? (
        <button id="signout-button" onClick={handleSignoutClick}>
          Sign Out
        </button>
      ) : (
        <button id="authorize-button" onClick={handleAuthClick}>
          Authorize
        </button>
      )}

      <button id="revoke-button" onClick={handleRevokeClick}>
        Revoke
      </button>

      <div id="content"></div>
    </>
  );
};

export default Authorize;
