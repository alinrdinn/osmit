import React, { Suspense, lazy } from "react";
import Axios from "axios";
import "./styles.min.css";
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";

const Navbar = lazy(() => import("./components/Navbar"));
const Home = lazy(() => import("./components/Home"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const AccountConf = lazy(() => import("./components/AccountConf"));
const AboutUsandPrice = lazy(() => import("./components/AboutUsandPrice"));
const Guide = lazy(() => import("./components/Guide"));
const Simulasi = lazy(() => import("./components/Simulasi"));
const config = require("./components/config");

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>Loading failed! Please reload.</p>;
    }

    return this.props.children;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: localStorage.getItem("authenticated"),
      user_data: {}
    };
  }

  componentDidMount() {
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
      <div className="css-h47494">
        <Router>
          <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar {...this.state} />
              <Switch>
                <PrivateRoute
                  exact
                  path="/simulation/:id"
                  component={() => <Simulasi />}
                />
                <PrivateRoute
                  exact
                  path="/guide/:id"
                  component={() => <Guide />}
                />
                <PrivateRoute
                  exact
                  path="/konfigurasiakun"
                  component={() => <AccountConf {...this.state} />}
                />
                <Route path="/aboutus">
                  <AboutUsandPrice />
                </Route>
                <Route path="/">
                  {this.state.authenticated ? (
                    <Dashboard {...this.state.user_data} />
                  ) : (
                    <Home />
                  )}
                </Route>
              </Switch>
            </Suspense>
          </ErrorBoundary>
        </Router>
      </div>
    );
  }
}

export default App;
