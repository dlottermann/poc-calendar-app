import { GoogleLogin } from "@leecheuk/react-google-login";
import { gapi, loadAuth2 } from "gapi-script";
import { useEffect } from "react";

const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Login = () => {
  const event = {
    summary: "Hello World",
    location: "800 Howard St., San Francisco, CA 94103",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: "2022-09-10T16:00:00.000",
      timeZone: "GMT-03:00",
    },
    end: {
      dateTime: "2022-09-10T17:00:00.000",
      timeZone: "GMT-03:00",
    },
    recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
    attendees: [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  const addEvent = (calendarID, event, accessToken) => {
    function initiate() {
      gapi.client
        .request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
          method: "POST",
          body: event,
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(
          (response) => {
            console.log("response", response);
            return [true, response];
          },
          function(err) {
            console.log(err);
            return [false, err];
          }
        );
    }
    gapi.load("client", initiate);
  };

  useEffect(() => {
    const setAuth2 = async () => {
      const auth2 = await loadAuth2(
        gapi,
        client_id,
        "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
      );
    };
    setAuth2();
  }, []);

  const onSuccess = (res) => {
    console.log("success");
  };

  const onFailure = (res) => console.log("Fail!: ", res);

  return (
    <div>
      <GoogleLogin
        client_id={client_id}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy="single_host_origin"
        isSignedIn
      />
    </div>
  );
};

export default Login;
