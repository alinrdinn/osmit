import React from "react";
import Axios from "axios";
import styles from "./styles.module.css";
const config = require("../config");

function MapToTag(courses) {
  var listItems = courses.map((item) => {
    return <Pelatihan {...item} />;
  });
  return listItems;
}

class Beranda extends React.Component {
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
      <div className={styles.body}>
        <div
          className={`${styles.halo_nama_depan} valign-text-middle roboto-normal-black-18px`}
        >
          Halo {this.props.name ? this.props.name[0] : null} !
        </div>
        <svg
          width="1088"
          height="1"
          viewBox="0 0 1088 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="4.37114e-08"
            y1="0.5"
            x2="1088"
            y2="0.500095"
            stroke="#2E4750"
          />
        </svg>
        <div className={styles.pelatihan}>
          <div>{MapToTag(this.state.course_data)}</div>
        </div>
      </div>
    );
  }
}

class Pelatihan extends React.Component {
  render() {
    return (
      <div className={`${styles.pelatihan_2}`}>
        <h1
          className={`${styles.text} valign-text-middle roboto-normal-black-24px`}
        >
          {this.props.course_type[0].toUpperCase() +
            this.props.course_type.substring(1)}
        </h1>
        <div className={styles.deskripsi}>
          {this.props.course_type === "panduan" ||
          this.props.course_type === "tips" ? (
            <a
              className={`valign-text-middle roboto-bold-black-18px`}
              href={"/panduanatautips/" + this.props.filename}
            >
              {this.props.course_name}
            </a>
          ) : (
            <a
              className={`valign-text-middle roboto-bold-black-18px`}
              href={"/simulasi/" + this.props.filename}
            >
              {this.props.course_name}
            </a>
          )}

          <div className={`valign-text-middle roboto-normal-black-14px`}>
            {this.props.course_desc}
          </div>
          <div className={styles.frame_1}>
            <div
              className={`valign-text-middle roboto-normal-limed-spruce-11px`}
            >
              {this.props.for_premium ? "Premium" : "Gratis"}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Beranda;
