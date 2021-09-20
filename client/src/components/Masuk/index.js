import React from "react";
import Axios from "axios";
import styles from "./styles.module.css";
const config = require("../config");

class Masuk extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <img className={styles.image_1} src="assets/cover.svg" />
        <Form />
      </div>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      keadaan_daftar: false,
      data: {},
      err: {}
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.validateInput2 = this.validateInput2.bind(this);
  }

  handleToggle(event) {
    event.preventDefault();
    this.setState((prevState) => ({
      loading: true,
      keadaan_daftar: !this.state.keadaan_daftar,
      data: {},
      err: {}
    }));
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    var temp = target.value;
    var value = temp;
    const name = target.name;

    this.setState(
      (prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          [name]: value
        }
      }),
      this.validateInput(event)
    );
  }

  submitForm(event) {
    event.preventDefault();
    this.setState((prevState) => ({ ...prevState, loading: true }));
    var api_url = this.state.keadaan_daftar
      ? config.api_url + "/users/signup"
      : config.api_url + "/users/login";
    Axios.post(api_url, JSON.stringify(this.state.data), {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        const keadaan_daftar = this.state.keadaan_daftar;
        this.handleToggle(event);
        if (res.status === 200) {
          this.setState((prevState) => ({
            ...prevState,
            res: res.data
          }));
          if (!keadaan_daftar) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("authenticated", res.data.success);
            window.location.reload();
          }
        }
      })
      .catch((err) => {
        this.handleToggle(event);

        this.setState((prevState) => ({
          ...prevState,
          res: { err: "Akun salah/tidak ada" }
        }));
      });
  }

  validateInput(event) {
    switch (event.target.name) {
      case "name":
        if (event.target.value === "") {
          this.setState(
            (prevState) => ({
              ...prevState,
              err: { ...prevState.err, name: "Nama tidak boleh kosong" }
            }),
            this.validateInput2
          );
        } else if (event.target.value.length < 3) {
          this.setState(
            (prevState) => ({
              ...prevState,
              err: { ...prevState.err, name: "Nama harus >= 3 karakter" }
            }),
            this.validateInput2
          );
        } else if (event.target.value.length > 10) {
          this.setState(
            (prevState) => ({
              ...prevState,
              err: { ...prevState.err, name: "Nama harus =< 10 karakter" }
            }),
            this.validateInput2
          );
        } else {
          const { name, ...data } = this.state.err;
          this.setState(
            (prevState) => ({ ...prevState, err: data }),
            this.validateInput2
          );
        }
        break;
      case "username":
        if (event.target.value === "") {
          const { username, ...data } = this.state.data;
          this.setState(
            (prevState) => ({
              ...prevState,
              err: { ...prevState.err, username: "Email tidak boleh kosong" }
            }),
            this.validateInput2
          );
        } else if (
          event.target.value.split("").filter((x) => x === "@").length !== 1
        ) {
          this.setState(
            (prevState) => ({
              ...prevState,
              err: { ...prevState.err, username: "Email harus memiliki @" }
            }),
            this.validateInput2
          );
        } else {
          const { username, ...data } = this.state.err;
          this.setState(
            (prevState) => ({ ...prevState, err: data }),
            this.validateInput2
          );
        }
        break;
      case "password":
        if (event.target.value === "") {
          this.setState(
            (prevState) => ({
              ...prevState,
              err: {
                ...prevState.err,
                password: "Password tidak boleh kosong"
              }
            }),
            this.validateInput2
          );
        } else if (event.target.value.length < 8) {
          this.setState(
            (prevState) => ({
              ...prevState,
              err: {
                ...prevState.err,
                password: "Password harus >= 8 karakter"
              }
            }),
            this.validateInput2
          );
        } else {
          const { password, ...data } = this.state.err;
          this.setState((prevState) => ({ err: data }), this.validateInput2);
        }
        break;
      default:
        break;
    }
  }

  validateInput2() {
    if (!this.state.keadaan_daftar) {
      if (
        Object.keys(this.state.data).length === 2 &&
        Object.keys(this.state.err).length === 0
      ) {
        this.setState((prevState) => ({ ...prevState, loading: false }));
      } else {
        this.setState((prevState) => ({ ...prevState, loading: true }));
      }
    } else {
      if (
        Object.keys(this.state.data).length === 3 &&
        Object.keys(this.state.err).length === 0
      ) {
        this.setState((prevState) => ({ ...prevState, loading: false }));
      } else {
        this.setState((prevState) => ({ ...prevState, loading: true }));
      }
    }
  }

  render() {
    return (
      <form className={styles.form} onSubmit={this.submitForm}>
        <h1 className={`${styles.title} roboto-bold-black-24px`}>
          {this.state.keadaan_daftar ? "Daftar" : "Masuk"}
        </h1>
        {this.state.res ? (
          this.state.res.success ? (
            <div className={`roboto-normal-black-14px ${styles.success}`}>
              {this.state.res.status}
            </div>
          ) : this.state.res.err ? (
            <div className={`roboto-normal-black-14px ${styles.err}`}>
              {this.state.res.err}
            </div>
          ) : null
        ) : null}
        {this.state.keadaan_daftar ? (
          <Input
            label="Nama"
            type="text"
            name="name"
            value={this.state.data.name}
            onChange={this.handleInputChange}
          />
        ) : null}
        {this.state.err.name ? (
          <div className={`roboto-normal-black-14px ${styles.err}`}>
            {this.state.err.name}
          </div>
        ) : null}
        <Input
          label="Email"
          type="text"
          name="username"
          value={this.state.data.username}
          onChange={this.handleInputChange}
        />
        {this.state.err.username ? (
          <div className={`roboto-normal-black-14px ${styles.err}`}>
            {this.state.err.username}
          </div>
        ) : null}
        <Input
          label="Password"
          type="password"
          name="password"
          value={this.state.data.password}
          onChange={this.handleInputChange}
        />
        {this.state.err.password ? (
          <div className={`roboto-normal-black-14px ${styles.err}`}>
            {this.state.err.password}
          </div>
        ) : null}
        <input
          type="submit"
          className={`${styles.submit} border-1px-black align-self-flex-start`}
          value={this.state.keadaan_daftar ? "DAFTAR" : "MASUK"}
          disabled={this.state.loading}
        />
        <p
          className={`${
            styles.text - 1
          } valign-text-middle roboto-normal-white-14px`}
        >
          <span>
            <span className="roboto-normal-black-14px">
              {this.state.keadaan_daftar
                ? "Punya akun? "
                : "Tidak punya akun? "}
            </span>
            <a
              className={`${styles.span1} roboto-normal-supernova-14px`}
              onClick={this.handleToggle}
            >
              {this.state.keadaan_daftar ? "Masuk di sini" : "Daftar di sini"}
            </a>
          </span>
        </p>
      </form>
    );
  }
}

class Input extends React.Component {
  render() {
    return (
      <div className={styles.password}>
        <div className={`${styles.password_1} roboto-normal-black-18px`}>
          {this.props.label}
        </div>
        <div className={styles.overlap_group1}>
          <input
            className={`${styles.masukkan_password} roboto-normal-limed-spruce-18px ${styles.rectangle} border-1px-mountain-mist`}
            name={this.props.name}
            placeholder="..."
            type={this.props.type}
            onChange={this.props.onChange}
            value={!this.props.value ? "" : this.props.value}
          />
        </div>
      </div>
    );
  }
}

export default Masuk;
