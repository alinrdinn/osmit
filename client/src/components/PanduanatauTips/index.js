import React from "react";
import Axios from "axios";
import styles from "./styles.module.css";
import { useParams } from "react-router-dom";
const config = require("../config");

function courseMapToTag(section) {
  var listItems = section.map((item) => {
    switch (item.tag) {
      case "h1":
        return (
          <h1 className={`${styles.title} roboto-bold-black-24px`}>
            {item.heading}
          </h1>
        );
      case "p":
        return (
          <p className={`${styles.text_3} roboto-normal-black-18px`}>
            {item.paragraph}
          </p>
        );
      default:
        break;
    }
  });
  return listItems;
}

class Body extends React.Component {
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
    Axios.get(config.api_url + "/courses/data/" + this.props.id, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then((res) => {
        this.setState({ res: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className={styles.body}>
        <div className={styles.tentang_kami}>
          {!this.state.res ? (
            <h1 className={`${styles.title} roboto-bold-black-24px`}>
              Loading...
            </h1>
          ) : this.state.res.success ? (
            courseMapToTag(this.state.res.data[this.state.section_number])
          ) : null}
          {this.state.res ? (
            this.state.res.success ? (
              Object.keys(this.state.res.data).length > 0 ? (
                this.state.section_number === 0 ? (
                  <button
                    id="next"
                    onClick={this.handleToggle}
                    className={`${styles.submit} ${styles.ganti} valign-text-middle roboto-normal-black-14px border-1px-black align-self-flex-start`}
                  >
                    Selanjutnya
                  </button>
                ) : this.state.section_number ===
                  Object.keys(this.state.res.data).length - 1 ? (
                  <button
                    id="prev"
                    onClick={this.handleToggle}
                    className={`${styles.submit} ${styles.ganti} valign-text-middle roboto-normal-black-14px border-1px-black align-self-flex-start`}
                  >
                    Sebelumnya
                  </button>
                ) : (
                  <div className={styles.nextprev}>
                    <button
                      id="prev"
                      onClick={this.handleToggle}
                      className={`${styles.submit} ${styles.ganti} valign-text-middle roboto-normal-black-14px border-1px-black align-self-flex-start`}
                    >
                      Sebelumnya
                    </button>
                    <button
                      id="next"
                      onClick={this.handleToggle}
                      className={`${styles.submit} ${styles.ganti} valign-text-middle roboto-normal-black-14px border-1px-black align-self-flex-start`}
                    >
                      Selanjutnya
                    </button>
                  </div>
                )
              ) : null
            ) : null
          ) : null}
        </div>
        <div className={styles.dibuat_dengan_cinta}>
          <div className={`${styles.text_7} roboto-normal-black-18px`}>
            Dibuat dengan <span className={styles.love}>❤</span> di Ciwaruga
          </div>
        </div>
      </div>
    );
  }
}

function PanduanatauTips() {
  const params = useParams();
  return <Body {...params} />;
}

export default PanduanatauTips;
