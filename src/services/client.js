import axios from 'axios';
import { API_URL } from 'Library/globalVar';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
  },
});

const req = (reqPromise) => {
  return reqPromise
    .then((res) => {
      res.config.data = {}
      return Promise.resolve(res)
    })
    .catch((err) => {
      if (err.response) err.message = err.response.data.message
      return Promise.reject(err);
    });
};

export default {
  req,
  apiClient,
}

