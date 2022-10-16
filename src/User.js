import { useState, Component } from "react";
import config from "./config";
import axios from "axios";
axios.defaults.withCredentials = true;

class User {
  constructor() {
    this.loading = true
    this.connected = false
    this.user = null
    this.timer = null
  }
  getInfo() {
    axios
    .get(`${config.backendPath}/api/info`)
    .then((r) => {
      console.log(r)
      if(r.data.success) {
        this.loading = false;
        this.connected = true;
        this.user = r.data.user
      } else {
        this.loading = false;
        this.connected = false;
        this.user = null
      }
    })
    .catch((err) => console.log(err));
  }
  login() {
    console.log(this)
    this.loading = true;
    const width = window.innerWidth * 0.35;
    const height = window.innerHeight * 0.9;
    const loginWindow = window.open(
      `${config.backendPath}/api/login`,
      "newwindow",
      "width=" +
        width +
        ", height=" +
        height +
        ", top=" +
        (window.innerHeight - height) +
        ", left=" +
        (window.innerWidth - width) / 2
    );
    this.timer = setInterval(() => {
      if (loginWindow.closed) {
        this.getInfo();
        clearInterval(this.timer);
      }
    }, 1000);
  }
  logout() {
    axios.post(`${config.backendPath}/api/logout`);
    return this.user = null;
  }
}

export default new User();