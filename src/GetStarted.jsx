import axios from "axios";
import React, { Component } from "react";
import config from "./config";

export default class GetStarted extends Component {
  constructor() {
    super()
    this.state = { connected: false, user: null, loading: true }
  }
  init() {
    axios.get(`${config.backendPath}/api/info`).then((r) => this.setState({connected: r.data.success, user: r.data.user ? r.data.user : null, loading: false}));
  }
  componentDidMount() {
    this.init();
  }
  render() {
    return (<div>{this.state.loading ? "Chargement..." : (this.state.connected ? this.state.user.username : "Se connecter")}</div>);
  }
}
