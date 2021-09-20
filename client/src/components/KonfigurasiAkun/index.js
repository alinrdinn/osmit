import React from "react";
import Axios from "axios";
import styles from "./styles.module.css";
const config = require("../config");

class KonfigurasiAkun extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <Form {...this.props} />
      </div>
    );
  }
}

export default KonfigurasiAkun;

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      input_state: 0,
      data: {},
      err: {}
    };
    this.inputState = this.inputState.bind(this);
    this.Span = this.Span.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.validateInput2 = this.validateInput2.bind(this);
  }

  Span() {
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

  inputState(key) {
    switch (key) {
      case 0:
        return (
          <div>
            <Input
              {...{
                label: "Nama",
                placeholder: "Masukkan Nama",
                tipe: "text",
                nama: "name",
                value: this.state.data.name,
                onChange: this.handleInputChange
              }}
            />
            {this.state.err.name ? (
              <div className={`roboto-normal-black-14px ${styles.err}`}>
                {this.state.err.name}
              </div>
            ) : null}
          </div>
        );
      case 1:
        return (
          <div>
            <Input
              {...{
                label: "Password Baru",
                placeholder: "Masukkan Password Baru",
                tipe: "password",
                nama: "new_password",
                value: this.state.data.new_password,
                onChange: this.handleInputChange
              }}
            />
            <Input
              {...{
                label: "Password Lama",
                placeholder: "Masukkan Password Lama",
                tipe: "password",
                nama: "old_password",
                value: this.state.data.old_password,
                onChange: this.handleInputChange
              }}
            />
            {this.state.err.password ? (
              <div className={`roboto-normal-black-14px ${styles.err}`}>
                {this.state.err.password}
              </div>
            ) : null}
          </div>
        );

      case 2:
        return (
          <div>
            {this.props.user_data.premium.status ? null : (
              <Input
                {...{
                  label: "Kunci Produk",
                  placeholder: "Masukkan kunci produk",
                  tipe: "text",
                  nama: "key",
                  value: this.state.data.key,
                  onChange: this.handleInputChange
                }}
              />
            )}
          </div>
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

    if (value !== "") {
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
    } else {
      this.setState(
        (prevState) => ({
          ...prevState,
          data: {
            ...prevState.data
          }
        }),
        this.validateInput(event)
      );
    }
  }

  submitForm(event) {
    event.preventDefault();
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

  validateInput(event) {
    switch (event.target.name) {
      case "name":
        if (event.target.value === "") {
          const { name, ...data } = this.state.data;
          {
            const { name, ...err } = this.state.err;
            this.setState(
              (prevState) => ({
                ...prevState,
                data: data,
                err: err
              }),
              this.validateInput2
            );
          }
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
      case "new_password":
      case "old_password":
        if (event.target.value === "") {
          const { old_password, new_password, ...data } = this.state.data;
          {
            const { old_password, new_password, ...err } = this.state.err;
            this.setState(
              (prevState) => ({
                ...prevState,
                data: data,
                err: err
              }),
              this.validateInput2
            );
          }
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
      case "key":
        if (event.target.value === "") {
          const { key, ...data } = this.state.data;
          {
            const { key, ...err } = this.state.err;
            this.setState(
              (prevState) => ({
                ...prevState,
                data: data,
                err: err
              }),
              this.validateInput2
            );
          }
        } else {
          const { key, ...data } = this.state.err;
          this.setState((prevState) => ({ err: data }), this.validateInput2);
        }
        break;
      default:
        break;
    }
  }

  validateInput2() {
    if (
      this.state.data.hasOwnProperty("old_password") ||
      this.state.data.hasOwnProperty("new_password")
    ) {
      if (
        Object.keys(this.state.data).length === 2 &&
        Object.keys(this.state.err).length === 0
      ) {
        this.setState((prevState) => ({ ...prevState, loading: false }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          err: {
            password: "Isi bidang lainnya"
          },
          loading: true
        }));
      }
    } else if (
      Object.keys(this.state.data).length >= 1 &&
      Object.keys(this.state.err).length === 0
    ) {
      this.setState((prevState) => ({ ...prevState, loading: false }));
    } else {
      console.log(1);
      this.setState((prevState) => ({ ...prevState, loading: true }));
    }
  }

  render() {
    return (
      <form className={styles.form} onSubmit={this.submitForm}>
        <h1 className={`${styles.title} roboto-bold-black-24px`}>
          {this.state.input_state === 2 ? "Rencana" : "Informasi Akun"}
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
        <div className={`${styles.text_1} roboto-normal-black-18px`}>
          {this.state.input_state === 2
            ? "Akun kamu adalah akun " +
              (this.props.user_data.premium.status ? "Premium" : "Gratis")
            : "Ubah informasi yang ingin diganti"}
          {this.state.input_state === 2
            ? this.props.user_data.premium.status
              ? " Berlaku hingga " + this.props.user_data.premium.till
              : null
            : null}
        </div>
        {this.inputState(this.state.input_state)}
        {this.state.input_state !== 2 ||
        !this.props.user_data.premium.status ? (
          <input
            type="submit"
            value="Submit"
            className={`${styles.submit} ${styles.ganti} valign-text-middle roboto-normal-black-14px border-1px-black align-self-flex-start`}
            disabled={this.state.loading}
          />
        ) : null}

        <p
          className={`${styles.text_2} valign-text-middle roboto-normal-white-14px`}
        >
          <span>
            <span className="roboto-normal-black-14px">
              Ingin mengubah{" "}
              {this.state.input_state === 0
                ? "Nama/Email"
                : this.state.input_state === 1
                ? "Password"
                : "Rencana"}
              ?
            </span>
            <span
              className={`${styles.span1} roboto-normal-supernova-14px`}
              onClick={this.Span}
            >
              Ubah disini
            </span>
          </span>
        </p>
      </form>
    );
  }
}

class Input extends React.Component {
  render() {
    return (
      <div className={styles.nama}>
        {this.props.nama === "password" ? (
          <div
            className={`${styles.konfirmasi_password} roboto-normal-black-18px`}
          >
            {this.props.label}
          </div>
        ) : (
          <div className={`${styles.nama_1} roboto-normal-black-18px`}>
            {this.props.label}
          </div>
        )}

        <div
          className={`${styles.overlap_group} ${styles.rectangle} border-1px-mountain-mist`}
        >
          <input
            className={`${styles.masukkan} roboto-normal-limed-spruce-18px`}
            name={this.props.nama}
            placeholder={this.props.placeholder}
            type={this.props.tipe}
            onChange={this.props.onChange}
            value={this.props.value ? this.props.value : ""}
          />
        </div>
      </div>
    );
  }
}
