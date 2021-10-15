import React from "react";
import Axios from "axios";
import { withRouter } from "react-router";
const config = require("../config");

function courseMapToTag(section) {
  var listItems = section.map((item) => {
    switch (item.tag) {
      case "h1":
        return (
          <h1 className="builder-block  css-mwga5u">
            <span className="builder-text css-1qggkls">{item.heading}</span>
          </h1>
        );
      case "p":
        return (
          <p className="builder-block css-gmszm9">
            <span className="builder-text css-1qggkls">{item.paragraph}</span>
          </p>
        );
      default:
        return <></>;
    }
  });
  return listItems;
}

class Guide extends React.Component {
  constructor(props) {
    super(props);
    this.state = { section_number: 0, res: undefined };
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event) {
    event.preventDefault();
    const id = event.target.id;
    switch (id) {
      case "next":
        this.setState((prevState) => ({
          ...prevState,
          section_number: prevState.section_number + 1
        }));
        break;
      case "prev":
        this.setState((prevState) => ({
          ...prevState,
          section_number: prevState.section_number - 1
        }));
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    let isMounted = true;
    Axios.get(config.api_url + "/courses/data/" + this.props.match.params.id, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then((res) => {
        if (isMounted) this.setState({ res: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  }

  render() {
    return (
      <div className="builder-block css-hitm5w">
        <div className="builder-block css-euyh6s">
          {!this.state.res
            ? null
            : this.state.res.success
            ? courseMapToTag(this.state.res.data[this.state.section_number])
            : null}
        </div>

        {this.state.res ? (
          this.state.res.success ? (
            Object.keys(this.state.res.data).length > 0 ? (
              <div className="builder-block  css-ap6kx1">
                <div className="builder-columns css-1840m1q">
                  {this.state.section_number === 0 ? (
                    <div className="builder-column css-2keume">
                      <div className="builder-blocks css-h47494">
                        <button
                          className="builder-block css-1mnwerk css-dvd2j0 builder-text css-1qggkls"
                          id="next"
                          onClick={this.handleToggle}
                        >
                          SELANJUTNYA
                        </button>
                      </div>
                    </div>
                  ) : this.state.section_number ===
                    Object.keys(this.state.res.data).length - 1 ? (
                    <div className="builder-column css-2keume">
                      <div className="builder-blocks css-h47494">
                        <button
                          className="builder-block css-1mnwerk css-dvd2j0 builder-text css-1qggkls"
                          id="prev"
                          onClick={this.handleToggle}
                        >
                          SEBELUMNYA
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="builder-column css-2keume">
                        <div className="builder-blocks css-h47494">
                          <button
                            className="builder-block css-1mnwerk css-dvd2j0 builder-text css-1qggkls"
                            id="prev"
                            onClick={this.handleToggle}
                          >
                            SEBELUMNYA
                          </button>
                        </div>
                      </div>

                      <div className="builder-column css-bst442">
                        <div className="builder-blocks css-h47494">
                          <button
                            className="builder-block css-1mnwerk css-dvd2j0 builder-text css-1qggkls"
                            id="next"
                            onClick={this.handleToggle}
                          >
                            SELANJUTNYA
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : null
          ) : null
        ) : null}
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

export default withRouter(Guide);
