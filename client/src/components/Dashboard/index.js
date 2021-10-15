import React from "react";
import Axios from "axios";
const config = require("../config");

function MapToTag(courses) {
  var listItems = courses.map((item) => {
    return <Pelatihan {...item} />;
  });
  return listItems;
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { course_data: [] };
  }

  componentDidMount() {
    Axios.get(config.api_url + "/courses/data", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then((res) => {
        this.setState({ course_data: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="builder-block css-1oprq6p">
        <span className="builder-block  css-vk3phe">
          <span className="builder-text css-1qggkls">
            Halo {this.props.name}!
          </span>
        </span>
        <div className="builder-block css-16ex2h3"></div>
        <div className="builder-block css-1iud6b4">
          {MapToTag(this.state.course_data)}
        </div>
        <div className="builder-block css-1y9pq1n"></div>
        <div className="builder-block css-1xbb6o8">
          <span className="builder-block css-1xodsls">
            <span className="builder-text css-1qggkls">
              Dibuat dengan ❤ di Ciwaruga
            </span>
          </span>
        </div>
      </div>
    );
  }
}

class Pelatihan extends React.Component {
  render() {
    return (
      <div className="builder-block css-1umx1uj">
        <div className="builder-columns css-1840m1q">
          <div className="builder-column css-1x4h7ac">
            <div className="builder-blocks css-h47494">
              <div className="builder-block css-ewqy75">
                <span className="builder-block css-x8ii2t">
                  <span className="builder-text css-1qggkls">
                    {this.props.course_type[0].toUpperCase() +
                      this.props.course_type.substring(1)}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="builder-column css-crohew">
            <div className="builder-blocks css-h47494">
              <div className="builder-block css-e0p6nn">
                <h1 className="builder-block  css-mwga5u">
                  <a
                    className="builder-text css-1qggkls"
                    href={
                      "/" +
                      (this.props.course_type === "panduan"
                        ? "guide"
                        : "simulation") +
                      "/" +
                      this.props.filename
                    }
                  >
                    {this.props.course_name}
                  </a>
                </h1>
                <p className="builder-block css-gmszm9">
                  <p className="builder-text css-1qggkls">
                    {this.props.course_desc}
                  </p>
                </p>
                <span className="builder-block css-1biizxv">
                  <span className="builder-text css-1qggkls">
                    {this.props.for_premium ? "Premium" : "Gratis"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
