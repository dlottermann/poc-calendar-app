import React, { useEffect, useRef, useState } from "react";
import { gapi } from "gapi-script";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

const scope =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

const Authorize = () => {
  const GoogleAuth = useRef(undefined);

  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('')

  const scopes = scope;

  async function handleAuthClick() {
    setIsLoading(true);
    try {
      await gapi.auth2.getAuthInstance().signIn();
    } catch (e) {
      if (e.error === "popup_closed_by_user") setIsLoading(false);
    }
  }

  function handleSignoutClick() {
    setIsLoading(true);
    gapi.auth2.getAuthInstance().signOut();
  }

  function handleRevokeClick() {
    setIsLoading(true);
    gapi.auth2.getAuthInstance().disconnect();
  }

  function setSigninStatus() {
    const user = GoogleAuth.current.currentUser.get();
    const isAuthorized = user.hasGrantedScopes(scopes);
    if (isAuthorized) {
      sessionStorage.setItem(
        "d.access_token",
        user.getAuthResponse().access_token
      );
      setIsSignedIn(isAuthorized)
      setToken(user.getAuthResponse().access_token)
    } else {
      sessionStorage.removeItem("d.access_token");
      setIsSignedIn(isAuthorized);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    gapi.load("client:auth2", async () => {
      await gapi.client.init({
        apiKey,
        clientId,
        scope,
        access_type: "offline",
        include_granted_scopes: true,
      });

      GoogleAuth.current = gapi.auth2.getAuthInstance();
      GoogleAuth.current.isSignedIn.listen(setSigninStatus);
      setSigninStatus();
    });
  }, [setSigninStatus]);

  return (
    <>
      <p>Calendar API.</p>

      {isSignedIn ? (
        <button disabled={isLoading} id="signout-button" onClick={handleSignoutClick}>
          Sign Out
        </button>
      ) : (
        <button disabled={isLoading} id="authorize-button" onClick={handleAuthClick}>
          Authorize
        </button>
      )}

      <button id="revoke-button" onClick={handleRevokeClick} disabled={isLoading}>
        Revoke
      </button>

      <button
        disabled={isLoading}
        id="revoke-button"
        onClick={() =>{;
          gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .reloadAuthResponse()
            setSigninStatus();
        }}
      >
        Refresh token
      </button>

      <div id="content">
        {token}
      </div>
    </>
  );
};

export default Authorize;
