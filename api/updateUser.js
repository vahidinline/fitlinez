import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './context';
import console from './console';
export default function UpdateUser(token, userId) {
  const { id } = userId;

  axios
    .put(`http://10.4.1.6:8080/api/userupdate/636b924326cfb726c5b5296f`, {
      token,
    })
    .then((res) => {
      console.log('res', res);
    })
    .catch((error) => {
      console.log('error', error);
    });
}
