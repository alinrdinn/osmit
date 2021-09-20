import React from "react";
import styles from "./styles.module.css";
import Axios from "axios";
const config = require("../config");
class Navbar extends React.Component {
  render() {
    return (
      <div className={styles.navbar}>
        <Logo />
        {this.props.authenticated ? (
          <NavigationLogin {...{ user_data: this.props.user_data }} />
        ) : (
          <NavigationTidakLogin />
        )}
      </div>
    );
  }
}

class Logo extends React.Component {
  render() {
    return (
      <a href="/">
        <img className="logo" src="assets/logo@2x.svg" />
      </a>
    );
  }
}

class NavigationLogin extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  logout(event) {
    event.preventDefault();
    Axios.get(config.api_url + "/users/logout", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then((res) => {
        localStorage.clear();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className={styles.navigation}>
        <div
          className={`${styles.text_3} valign-text-middle roboto-normal-black-14px`}
        >
          {this.props.user_data.premium
            ? this.props.user_data.premium.status
              ? "PREMIUM"
              : "GRATIS"
            : null}
        </div>
        <a href="/konfigurasiakun">
          <div className={`${styles.about_us} border-1px-black`}>
            <div
              className={`${styles.text_1} valign-text-middle roboto-normal-black-14px`}
            >
              KONFIGURASI AKUN
            </div>
          </div>
        </a>
        <a onClick={this.logout} href="">
          <div className={`${styles.pricing} border-1px-black`}>
            <div
              className={`${styles.text_2} valign-text-middle roboto-normal-black-14px`}
            >
              KELUAR
            </div>
          </div>
        </a>
      </div>
    );
  }
}

class NavigationTidakLogin extends React.Component {
  render() {
    return (
      <div className={styles.navigation}>
        <a href="/tentangkamidanharga">
          <div className={`${styles.about_us} border-1px-black`}>
            <div
              className={`${styles.text_1} valign-text-middle roboto-normal-black-14px`}
            >
              TENTANG KAMI & HARGA
            </div>
          </div>
        </a>
      </div>
    );
  }
}

export default Navbar;
