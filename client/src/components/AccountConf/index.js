import React from "react";
import Axios from "axios";
const config = require("../config");

class AccountConf extends React.Component {
  render() {
    return (
      <>
        <div className="builder-block css-etr2hy">
          <Form {...this.props} />
        </div>
      </>
    );
  }
}

export default AccountConf;

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      input_state: 0,
      data: {},
      err: {}
    };
    this.setInput = this.setInput.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.validateSubmission = this.validateSubmission.bind(this);
  }

  handleToggle() {
    if (this.state.input_state === 2) {
      this.setState({
        input_state: 0,
        loading: true,
        data: {},
        err: {}
      });
    } else {
      this.setState({
        input_state: this.state.input_state + 1,
        loading: true,
        data: {},
        err: {}
      });
    }
  }

  setInput(key) {
    switch (key) {
      case 0:
        return (
          <Input
            {...{
              label: "Nama",
              placeholder: "Masukkan Nama",
              tipe: "text",
              nama: "name",
              value: this.state.data.name,
              onChange: this.handleInputChange,
              err: this.state.err.name
            }}
          />
        );
      case 1:
        return (
          <>
            <Input
              {...{
                label: "Password Baru",
                placeholder: "Masukkan Password Baru",
                tipe: "password",
                nama: "new_password",
                value: this.state.data.new_password,
                onChange: this.handleInputChange,
                err: this.state.err.new_password
              }}
            />
            <Input
              {...{
                label: "Password Lama",
                placeholder: "Masukkan Password Lama",
                tipe: "password",
                nama: "old_password",
                value: this.state.data.old_password,
                onChange: this.handleInputChange,
                err: this.state.err.old_password
              }}
            />
          </>
        );

      case 2:
        return this.props.user_data.premium.status ? (
          <div className="builder-block css-awle9n">
            <h1 className="builder-block  css-mwga5u">
              <span className="builder-text css-1qggkls">Informasi Akun</span>
            </h1>
            <span className="builder-block  css-1p04ug8">
              <span className="builder-text css-1qggkls">
                Akun kamu adalah akun premium. Berlaku hingga{" "}
                {this.props.user_data.premium.till}
              </span>
            </span>
            <div className="builder-block css-1xbb6o8">
              <span className="builder-block css-1xodsls">
                <span className="builder-text css-1qggkls">
                  Dibuat dengan ❤ di Ciwaruga
                </span>
              </span>
            </div>
          </div>
        ) : (
          <Input
            {...{
              label: "Kunci Produk",
              placeholder: "Masukkan kunci produk",
              tipe: "text",
              nama: "key",
              value: this.state.data.key,
              onChange: this.handleInputChange,
              err: this.state.err.key
            }}
          />
        );
      default:
        break;
    }
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
      this.validateInput(target)
    );
  }

  submitForm(event) {
    event.preventDefault();
    if (!this.validateSubmission) {
      return;
    }
    var api_url;
    this.setState((prevState) => ({ ...prevState, loading: true }));
    switch (this.state.input_state) {
      case 0:
        api_url = config.api_url + "/users/changedata";
        break;
      case 1:
        api_url = config.api_url + "/users/changepassword";
        break;
      case 2:
        api_url = config.api_url + "/users/upgrade";
        break;
      default:
        break;
    }
    Axios.post(api_url, JSON.stringify(this.state.data), {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then((res) => {
        if (res.status === 200) {
          this.setState((prevState) => ({
            input_state: 0,
            loading: true,
            data: {},
            err: {},
            res: res.data
          }));
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState((prevState) => ({
          input_state: 0,
          loading: true,
          data: {},
          err: {},
          res: { err: "Perubahan Gagal" }
        }));
      });
  }

  validateInput(target) {
    switch (target.name) {
      case "name":
        if (
          target.value === "" ||
          target.value.length < 3 ||
          target.value.length > 10
        ) {
          this.setState((prevState) => ({
            ...prevState,
            err: {
              ...prevState.err,
              name:
                "Nama tidak boleh kosong, harus >= 3 karakter dan <= 10 karakter"
            }
          }));
        } else {
          const { name, ...data } = this.state.err;
          this.setState((prevState) => ({ ...prevState, err: data }));
        }
        break;
      case "new_password":
      case "old_password":
        if (target.value.length < 8 || target.value === "") {
          this.setState((prevState) => ({
            ...prevState,
            err: {
              ...prevState.err,
              [target.name]:
                "Password tidak boleh kosong, dan harus >= 8 karakter"
            }
          }));
        } else {
          if (target.name === "new_password") {
            const { new_password, ...data } = this.state.err;
            this.setState((prevState) => ({ ...prevState, err: data }));
          } else {
            const { old_password, ...data } = this.state.err;
            this.setState((prevState) => ({ ...prevState, err: data }));
          }
        }
        break;
      case "key":
        if (target.value === "") {
          this.setState((prevState) => ({
            ...prevState,
            err: {
              ...prevState.err,
              key: "Key tidak boleh kosong"
            }
          }));
        } else {
          const { key, ...data } = this.state.err;
          this.setState((prevState) => ({ ...prevState, err: data }));
        }
        break;
      default:
        break;
    }
  }

  validateSubmission() {
    if (
      ((this.state.data.hasOwnProperty("old_password") &&
        this.state.data.hasOwnProperty("new_password")) ||
        this.state.data.hasOwnProperty("name") ||
        this.state.data.hasOwnProperty("key")) &&
      Object.keys(this.state.err).length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <form className="builder-block css-awle9n" onSubmit={this.submitForm}>
        <h1 className="builder-block  css-mwga5u">
          <span className="builder-text css-1qggkls">Informasi Akun</span>
        </h1>
        <span className="builder-block  css-1p04ug8">
          <span className="builder-text css-1qggkls">
            Ganti informasi berhasil
          </span>
        </span>
        {this.setInput(this.state.input_state)}
        <input
          type="submit"
          className="builder-block css-z0fpat"
          value="Submit"
        />
        <div className="builder-block css-qupa4l">
          <span
            className="builder-text css-1qggkls"
            onClick={this.handleToggle}
          >
            Ubah Informasi Lain
          </span>
        </div>
        <div className="builder-block css-1y9pq1n"></div>
        <div className="builder-block css-1xbb6o8">
          <span className="builder-block css-1xodsls">
            <span className="builder-text css-1qggkls">
              Dibuat dengan ❤ di Ciwaruga
            </span>
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
        <label htmlFor="newpassword" className="builder-block css-gy6hil">
          <span className="builder-text css-1qggkls">{this.props.label}</span>
        </label>
        <input
          name={this.props.nama}
          placeholder={this.props.placeholder}
          type={this.props.tipe}
          onChange={this.props.onChange}
          value={this.props.value ? this.props.value : ""}
          className="builder-block  css-wjk3sb"
        />
        <span className="builder-block  css-1sqkeg1">
          <span className="builder-text css-1qggkls">{this.props.err}</span>
        </span>
      </div>
    );
  }
}
