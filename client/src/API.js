export const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/v1/messages"
    : "https://whispering-stream-70752.herokuapp.com/api/v1/messages";

export const getMessages = () => {
  return fetch(API_URL)
    .then(res => res.json())
    .then(messages => {
      const haveSeenLocation = {};
      return messages.reduce((all, message) => {
        const key = `${message.latitude.toFixed(3)}${message.longitude.toFixed(
          3
        )}`;
        if (haveSeenLocation[key]) {
          haveSeenLocation[key].otherMessages =
            haveSeenLocation[key].otherMessages || [];
          haveSeenLocation[key].otherMessages.push(message);
        } else {
          haveSeenLocation[key] = message;
          all.push(message);
        }
        return all;
      }, []);
    });
};

export const getLocation = () => {
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        resolve(
          fetch("https://ipapi.co/json")
            .then(res => res.json())
            .then(location => {
              return {
                lat: location.latitude,
                lng: location.longitude
              };
            })
        );
      }
    );
  });
};

export const sendMessage = message => {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  }).then(res => res.json());
};
