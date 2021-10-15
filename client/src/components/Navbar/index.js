import React from "react";
class Navbar extends React.Component {
  render() {
    return (
      <div className="builder-block css-1ajtaqb">
        <div className="builder-block css-bcw198">
          <div className=" css-4hjrt3">
            <img
              alt="logo"
              loading="lazy"
              className=" css-1hbf805"
              src="assets/logo@2x.svg"
            />
          </div>
        </div>
        {this.props.authenticated ? (
          <Login {...{ user_data: this.props.user_data }} />
        ) : (
          <NotLogin />
        )}
      </div>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  logout(event) {
    localStorage.clear();
    window.location.reload();
  }
  render() {
    return (
      <div className="builder-block css-14i0vld">
        <div className="builder-columns css-1840m1q">
          <div className="builder-column css-7was6r">
            <div className="builder-blocks css-h47494">
              <div className="builder-block css-12cj89e">
                <span className="builder-block css-wkjvb4">
                  <span className="builder-text css-1qggkls">
                    {this.props.user_data.premium
                      ? this.props.user_data.premium.status
                        ? "PREMIUM"
                        : "GRATIS"
                      : null}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="builder-column css-7was6r">
            <div className="builder-blocks css-h47494">
              <button className="builder-block css-1mnwerk">
                <a
                  className="builder-block  css-dvd2j0"
                  href="/konfigurasiakun"
                >
                  <span className="builder-text css-1qggkls">KONF. AKUN</span>
                </a>
              </button>
            </div>
          </div>
          <div className="builder-column css-7was6r">
            <div className="builder-blocks css-h47494">
              <button className="builder-block css-1mnwerk">
                <a className="builder-block  css-dvd2j0" onClick={this.logout}>
                  <span className="builder-text css-1qggkls">KELUAR</span>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class NotLogin extends React.Component {
  render() {
    return (
      <button className="builder-block css-1mnwerk">
        <a className="builder-block  css-dvd2j0" href="/aboutus">
          <span className="builder-text css-1qggkls">HARGA &amp; KAMI</span>
        </a>
      </button>
    );
  }
}

export default Navbar;
