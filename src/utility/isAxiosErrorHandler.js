import {isAxiosError} from 'axios';

const isAxiosErrorHandler = error => {
  if (isAxiosError(error)) {
    console.log(error);
    return error.response?.data.message || error.message;
  } else {
    return 'An unexpected error';
  }
};

export default isAxiosErrorHandler;
