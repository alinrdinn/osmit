import React from "react";
import Axios from "axios";
import "./globals.css";
import "./styles.css";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Masuk from "./components/Masuk";
import Beranda from "./components/Beranda";
import KonfigurasiAkun from "./components/KonfigurasiAkun";
import TentangKamidanHarga from "./components/TentangKamidanHarga";
import PanduanataTips from "./components/PanduanatauTips";
import Simulasi from "./components/Simulasi";
const config = require("./components/config");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: localStorage.getItem("authenticated"),
      user_data: {}
    };
  }

  componentWillMount() {
    if (this.state.authenticated) {
      Axios.get(config.api_url + "/users/data", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      })
        .then((res) => {
          this.setState({ user_data: res.data.data });
        })
        .catch((err) => {
          console.log(err);
          localStorage.clear();
          if (this.state.authenticated) {
            window.location.reload();
          }
        });
    }
  }

  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) =>
          this.state.authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
    return (
      <Router>
        <div className="container-center-horizontal">
          <div className="masuk screen">
            <Navbar {...this.state} />
            <Switch>
              <PrivateRoute
                exact
                path="/simulasi/:id"
                component={() => <Simulasi />}
              />
              <PrivateRoute
                exact
                path="/panduanatautips/:id"
                component={() => <PanduanataTips />}
              />
              <Route path="/tentangkamidanharga">
                <TentangKamidanHarga />
              </Route>
              <PrivateRoute
                exact
                path="/konfigurasiakun"
                component={() => <KonfigurasiAkun {...this.state} />}
              />
              <Route path="/">
                {this.state.authenticated ? (
                  <Beranda {...this.state.user_data} />
                ) : (
                  <Masuk />
                )}
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
