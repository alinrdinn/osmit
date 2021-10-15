import React from "react";
import Axios from "axios";
const config = require("../config");

class Home extends React.Component {
  render() {
    return (
      <div className="builder-block css-50hn9i">
        <div className="builder-block css-etr2hy">
          <div className="builder-block css-t9ew7r">
            <div className=" css-uvqxkb">
              <img
                alt="logo"
                loading="lazy"
                className=" css-12153wi"
                src="assets/cover.svg"
              />
            </div>
          </div>
          <Form />
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

export default Home;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      on_submission: false,
      is_signup: false,
      data: {},
      err: {}
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.validateSubmission = this.validateSubmission.bind(this);
  }

  handleToggle(event) {
    event.preventDefault();
    if (this.state.on_submission) {
      return;
    }
    this.setState({
      on_submission: false,
      is_signup: !this.state.is_signup,
      data: {},
      err: {}
    });
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    var value = target.value;
    const name = target.name;

    this.setState(
      (prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          [name]: value
        }
      }),
      this.validateInput(target)
    );
  }

  validateInput(target) {
    switch (target.name) {
      case "name":
        if (
          target.value === "" ||
          target.value.length < 3 ||
          target.value.length > 3
        ) {
          this.setState((prevState) => ({
            ...prevState,
            err: {
              ...prevState.err,
              name:
                "Nama tidak boleh kosong, harus >= 3 karakter atau <= karakter"
            }
          }));
        } else {
          const { name, ...data } = this.state.err;
          this.setState((prevState) => ({ ...prevState, err: data }));
        }
        break;
      case "username":
        if (
          target.value === "" ||
          target.value.split("").filter((x) => x === "@").length !== 1
        ) {
          this.setState((prevState) => ({
            ...prevState,
            err: {
              ...prevState.err,
              username: "Email tidak boleh kosong, harus memiliki @"
            }
          }));
        } else {
          const { username, ...data } = this.state.err;
          this.setState((prevState) => ({ ...prevState, err: data }));
        }
        break;
      case "password":
        if (target.value === "" || target.value.length < 8) {
          this.setState((prevState) => ({
            ...prevState,
            err: {
              ...prevState.err,
              password: "Password tidak boleh kosong, harus >= 8 karakter"
            }
          }));
        } else {
          const { password, ...data } = this.state.err;
          this.setState((prevState) => ({ ...prevState, err: data }));
        }
        break;
      default:
        break;
    }
  }

  validateSubmission() {
    if (!this.state.is_signup) {
      if (
        Object.keys(this.state.data).length === 2 &&
        Object.keys(this.state.err).length === 0 &&
        !this.state.on_submission
      ) {
        this.setState((prevState) => ({
          ...prevState,
          on_submission: true
        }));
        return true;
      } else {
        return false;
      }
    } else {
      if (
        Object.keys(this.state.data).length === 3 &&
        Object.keys(this.state.err).length === 0 &&
        !this.state.on_submission
      ) {
        this.setState((prevState) => ({
          ...prevState,
          on_submission: true
        }));
        return true;
      } else {
        return false;
      }
    }
  }

  submitForm(event) {
    event.preventDefault();
    if (!this.validateSubmission) {
      return;
    }
    var api_url = this.state.is_signup
      ? config.api_url + "/users/signup"
      : config.api_url + "/users/login";
    Axios.post(api_url, JSON.stringify(this.state.data), {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (res.status === 200) {
          this.setState((prevState) => ({
            ...prevState,
            res: res.data,
            on_submission: false
          }));
          if (!this.state.is_signup) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("authenticated", res.data.success);
            window.location.reload();
          }
        }
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          res: { err: true }
        }));
      });
  }

  render() {
    return (
      <form className="builder-block css-awle9n" onSubmit={this.submitForm}>
        <h1 className="builder-block  css-mwga5u">
          <span className="builder-text css-1qggkls">
            {this.state.is_signup ? "Daftar" : "Masuk"}
          </span>
        </h1>
        {this.state.res ? (
          this.state.res.success ? (
            <span className="builder-block  css-1p04ug8">
              <span className="builder-text css-1qggkls">Berhasil</span>
            </span>
          ) : this.state.res.err ? (
            <span className="builder-block  css-1sqkeg1">
              <span className="builder-text css-1qggkls">Gagal</span>
            </span>
          ) : null
        ) : null}
        {this.state.is_signup ? (
          <Input
            label="Nama"
            type="text"
            name="name"
            value={this.state.data.name}
            onChange={this.handleInputChange}
            err={this.state.err.name}
          />
        ) : null}
        <Input
          label="Email"
          type="text"
          name="username"
          value={this.state.data.username}
          onChange={this.handleInputChange}
          err={this.state.err.username}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={this.state.data.password}
          onChange={this.handleInputChange}
          err={this.state.err.password}
        />
        <input
          type="submit"
          className="builder-block css-z0fpat"
          value="Submit"
        />
        <div className="builder-block  css-qupa4l">
          <span
            className="builder-text css-1qggkls"
            onClick={this.handleToggle}
          >
            atau {this.state.is_signup ? "Masuk" : "Daftar"} disini
          </span>
        </div>
      </form>
    );
  }
}

class Input extends React.Component {
  render() {
    return (
      <div className="builder-block css-di1mic">
        <label htmlFor={this.props.name} className="builder-block  css-gy6hil">
          <span className="builder-text css-1qggkls">{this.props.label}</span>
        </label>
        <input
          name={this.props.name}
          type={this.props.type}
          onChange={this.props.onChange}
          value={!this.props.value ? "" : this.props.value}
          className="builder-block  css-wjk3sb"
        />
        {this.props.err ? (
          <span className="builder-block  css-1sqkeg1">
            <span className="builder-text css-1qggkls">{this.props.err}</span>
          </span>
        ) : null}
      </div>
    );
  }
}
