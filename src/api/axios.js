import axios from "axios";

const instance = axios.create({
  baseURL: "https://scrappingtaskmanagementbe-hvdv.onrender.com/api",
  //baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default instance;
