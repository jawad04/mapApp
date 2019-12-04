const request = require("supertest");

const app = require("../src/app");

describe("GET /api/v1", () => {
  it("responds with a json message", function(done) {
    request(app)
      .get("/api/v1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "API - 👋🌎🌍🌏"
        },
        done
      );
  });
});

describe("POST /api/v1/messages", () => {
  it("responds with inserted message", function(done) {
    const requestObj = {
      name: "JM",
      message: "This is cool",
      latitude: -90,
      longitude: 180
    };
    const responseObj = {
      ...requestObj,
      _id: "5de7326c96b6f9c18c09c6e4",
      date: "2019-12-04T04:13:32.786Z"
    };
    request(app)
      .post("/api/v1/messages")
      .send(requestObj)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res => {
        (res.body._id = "5de7326c96b6f9c18c09c6e4"),
          (res.body.date = "2019-12-04T04:13:32.786Z");
      })
      .expect(200, responseObj, done);
  });
  it("can signup with name that has diacritics", done => {
    const requestObj = {
      name: "SØRINA_dấumóc",
      message: "This is cool",
      latitude: -90,
      longitude: 180
    };
    const responseObj = {
      ...requestObj,
      _id: "5de7326c96b6f9c18c09c6e4",
      date: "2019-12-04T04:13:32.786Z"
    };
    request(app)
      .post("/api/v1/messages")
      .send(requestObj)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(res => {
        (res.body._id = "5de7326c96b6f9c18c09c6e4"),
          (res.body.date = "2019-12-04T04:13:32.786Z");
      })
      .expect(200, responseObj, done);
  });
});
