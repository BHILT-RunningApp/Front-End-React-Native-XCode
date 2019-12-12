import React from 'react';
import axios from 'axios';

const url = 'https://project-bhilt.appspot.com/api';

const getUser = async (username, password) => {
  console.log('before get request');
  const {data} = await axios.get(`${url}/users`);

  const user = data.users.filter(
    userObj => userObj.username === username && userObj.password === password,
  );

  return user;
};

export default getUser;
