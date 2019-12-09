import React, { Component } from "react";
import * as Joi from "@hapi/joi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Card,
  Button,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import L from "leaflet";

import "./App.css";
import userLocationUrl from "./user_location.svg";
import messageLocationUrl from "./message_location.svg";

var myIcon = L.icon({
  iconUrl: userLocationUrl,
  iconSize: [50, 82],
  iconAnchor: [0, 82],
  popupAnchor: [0, -82]
});

var messageIcon = L.icon({
  iconUrl: messageLocationUrl,
  iconSize: [50, 82],
  iconAnchor: [0, 82],
  popupAnchor: [0, -82]
});

const schema = Joi.object({
  name: Joi.string().required(),
  message: Joi.string()
    .min(1)
    .max(500)
    .required()
});

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/v1/messages"
    : "https://whispering-stream-70752.herokuapp.com/api/v1/messages";

class App extends Component {
  state = {
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
    messages: []
  };

  componentDidMount() {
    fetch(API_URL)
      .then(res => res.json())
      .then(messages => {
        const haveSeenLocation = {};
        messages = messages.reduce((all, message) => {
          const key = `${message.latitude.toFixed(
            3
          )}${message.longitude.toFixed(3)}`;
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
        this.setState({
          messages
        });
      });
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          haveUsersLocation: true,
          zoom: 13
        });
      },
      () => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(location => {
            this.setState({
              location: {
                lat: location.latitude,
                lng: location.longitude
              },
              haveUsersLocation: true,
              zoom: 13
            });
          });
      }
    );
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
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.userMessage.name,
          message: this.state.userMessage.message,
          latitude: this.state.location.lat,
          longitude: this.state.location.lng
        })
      })
        .then(res => res.json())
        .then(message => {
          console.log(message);
          setTimeout(() => {
            this.setState({ sendingMessage: false, sentMessage: true });
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
        <Card body className="message-form">
          <CardTitle>Welcome to MapApp!</CardTitle>
          <CardText>Leave a message with your location!</CardText>
          <CardText>Thanks for stopping by!</CardText>
          {!this.state.sendingMessage &&
          !this.state.sentMessage &&
          this.state.haveUsersLocation ? (
            <Form onSubmit={this.formSubmited}>
              <FormGroup row>
                <Label for="name">Name</Label>{" "}
                <Input
                  type="name"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  onChange={this.valueChanged}
                />{" "}
              </FormGroup>
              <FormGroup row>
                <Label for="message">Message</Label>
                <Input
                  type="textarea"
                  name="message"
                  id="message"
                  placeholder="Enter a message"
                  onChange={this.valueChanged}
                />
              </FormGroup>
              <Button type="submit" color="info" disabled={!this.formIsValid()}>
                Send
              </Button>
            </Form>
          ) : this.state.sendingMessage || !this.state.haveUsersLocation ? (
            <video
              autoPlay
              loop
              src="https://i.giphy.com/media/BCIRKxED2Y2JO/giphy.mp4"
            ></video>
          ) : (
            <CardText>Thanks for submitting a message!</CardText>
          )}
        </Card>
      </div>
    );
  }
}

export default App;
