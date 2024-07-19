import console from './console';
import api from './api';
export default function UpdateUser(token, userId) {
  const { id } = userId;

  api
    .put(`/api/userupdate/636b924326cfb726c5b5296f`, {
      token,
    })
    .then((res) => {
      console.log('res', res);
    })
    .catch((error) => {
      console.log('error', error);
    });
}
