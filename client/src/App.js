import React, { Component } from "react";
import * as Joi from "@hapi/joi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import MessageCard from "./MessageCard";

import L from "leaflet";

import "./App.css";
import userLocationUrl from "./user_location.svg";
import messageLocationUrl from "./message_location.svg";
import { getMessages, getLocation, sendMessage } from "./API";

var myIcon = L.icon({
  iconUrl: userLocationUrl,
  iconSize: [50, 82]
});

var messageIcon = L.icon({
  iconUrl: messageLocationUrl,
  iconSize: [50, 82]
});

const schema = Joi.object({
  name: Joi.string().required(),
  message: Joi.string()
    .min(1)
    .max(500)
    .required()
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: 51.505,
        lng: -0.09
      },
      haveUsersLocation: false,
      zoom: 2,
      userMessage: {
        name: "",
        message: ""
      },
      sendingMessage: false,
      sentMessage: false,
      messages: [],
      isOpen: false
    };
    this.toglle = this.toglle.bind(this);
  }

  componentDidMount() {
    getMessages().then(messages => {
      this.setState({ messages });
    });

    getLocation().then(location => {
      this.setState({
        location,
        haveUsersLocation: true,
        zoom: 13
      });
    });
  }

  formIsValid = () => {
    const userMessage = {
      name: this.state.userMessage.name,
      message: this.state.userMessage.message
    };
    const { error } = schema.validate(userMessage);
    return !error && this.state.haveUsersLocation ? true : false;
  };
  formSubmited = event => {
    event.preventDefault();

    if (this.formIsValid()) {
      this.setState({
        sendingMessage: true
      });

      const message = {
        name: this.state.userMessage.name,
        message: this.state.userMessage.message,
        latitude: this.state.location.lat,
        longitude: this.state.location.lng
      };

      sendMessage(message).then(result => {
        setTimeout(() => {
          this.setState({
            sendingMessage: false,
            sentMessage: true
          });
        }, 1000);
      });
    }
  };
  valueChanged = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value
      }
    }));
  };
  toglle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  render() {
    const position = [this.state.location.lat, this.state.location.lng];

    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.haveUsersLocation && (
            <Marker position={position} icon={myIcon}></Marker>
          )}
          {this.state.messages.map(message => (
            <Marker
              key={message._id}
              position={[message.latitude, message.longitude]}
              icon={messageIcon}
            >
              <Popup>
                <p>
                  <em>
                    {message.name}: {message.message}
                  </em>
                </p>
                {message.otherMessages &&
                  message.otherMessages.map(message => (
                    <p key={message._id}>
                      <em>
                        {message.name}: {message.message}
                      </em>
                    </p>
                  ))}
              </Popup>
            </Marker>
          ))}
        </Map>
        <MessageCard
          sendingMessage={this.state.sendingMessage}
          sentMessage={this.state.sentMessage}
          haveUsersLocation={this.state.haveUsersLocation}
          formSubmited={this.formSubmited}
          valueChanged={this.valueChanged}
          formIsValid={this.formIsValid}
          toglle={this.toglle}
          isOpen={this.state.isOpen}
        />
      </div>
    );
  }
}

export default App;
