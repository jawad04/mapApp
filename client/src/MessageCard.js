import React from "react";
import {
  Card,
  Button,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  Collapse
} from "reactstrap";
export default props => {
  return (
    <Card body className="message-form">
      <Button className="show-btn" onClick={props.toglle}>
        {props.isOpen ? <span>Hide</span> : <span>Show</span>}
      </Button>
      <Collapse isOpen={props.isOpen}>
        {!props.sendingMessage &&
        !props.sentMessage &&
        props.haveUsersLocation ? (
          <Form onSubmit={props.formSubmited}>
            <FormGroup row>
              <Label for="name">Name</Label>{" "}
              <Input
                type="name"
                name="name"
                id="name"
                placeholder="Enter your name"
                onChange={props.valueChanged}
              />{" "}
            </FormGroup>
            <FormGroup row>
              <Label for="message">Message</Label>
              <Input
                type="textarea"
                name="message"
                id="message"
                placeholder="Enter a message"
                onChange={props.valueChanged}
              />
            </FormGroup>
            <Button type="submit" color="info" disabled={!props.formIsValid()}>
              Send
            </Button>
          </Form>
        ) : props.sendingMessage || !props.haveUsersLocation ? (
          <video
            autoPlay
            loop
            src="https://i.giphy.com/media/BCIRKxED2Y2JO/giphy.mp4"
          ></video>
        ) : (
          <CardText>Thanks for submitting a message!</CardText>
        )}
      </Collapse>
    </Card>
  );
};
