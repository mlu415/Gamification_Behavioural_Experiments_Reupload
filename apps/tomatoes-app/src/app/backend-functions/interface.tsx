import axios, { AxiosRequestHeaders } from 'axios';
import { auth } from 'libs/api-interfaces/src/firebase_config';
export const SERVER_URL =
  !process.env['NODE_ENV'] || process.env['NODE_ENV'] === 'development'
    ? 'api'
    : 'http://tomatoesapi-env.eba-2b3nbrwf.ap-southeast-2.elasticbeanstalk.com/api';

export const getHeaders = async (): Promise<AxiosRequestHeaders> => {
  const token = await auth.currentUser?.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const getData = async (url: string, data = {}) => {
  console.log('sent GET to ' + `${SERVER_URL}/${url}`);
  const response = await axios
    .get(`${SERVER_URL}/${url}`, {
      headers: await getHeaders(),
      ...(data && { params: data }),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      console.log(error);
      return error.response;
    });
  return response;
};

export const getDataNoAuth = async (url: string, data = {}) => {
  console.log('sent GET to ' + `${SERVER_URL}/${url}`);
  const response = await axios
    .get(`${SERVER_URL}/${url}`, {
      ...(data && { params: data }),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      console.log(error);
      return error.response;
    });
  return response;
};

export const postData = async (url: string, data = {}) => {
  console.log('sent POST to ' + `${SERVER_URL}/${url}`);
  const response = await axios
    .post(`${SERVER_URL}/${url}`, data, {
      headers: await getHeaders(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      console.log(error);
      return error.response;
    });
  return response;
};

export const putData = async (url: string, data = {}) => {
  const response = await axios
    .put(`${SERVER_URL}/${url}`, data, {
      headers: await getHeaders(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      console.log(error);
      return error.response;
    });
  return response;
};

export const patchData = async (url: string, data = {}) => {
  console.log('sent PATCH to ' + `${SERVER_URL}/${url}`);
  const response = await axios
    .patch(`${SERVER_URL}/${url}`, data, {
      headers: await getHeaders(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      console.log(error);
      return error.response;
    });
  return response;
};

export const deleteData = async (url: string, data = {}) => {
  console.log('sent PATCH to ' + `${SERVER_URL}/${url}`);
  const response = await axios
    .delete(`${SERVER_URL}/${url}`, {
      headers: await getHeaders(),
    })
    .then((response: any) => {
      return response;
    })
    .catch((error: any) => {
      console.log(error);
      return error.response;
    });
  return response;
};
