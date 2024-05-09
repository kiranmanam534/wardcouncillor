import * as yup from 'yup';

const SignupValidationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  cellNumber: yup
    .string()
    .max(10, 'Cell Number must be 10 digits')
    .required('Cell Number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  // IDNumber: yup
  //   .string()
  //   .min(13, 'ID Number must be 13 digits')
  //   .max(13, 'ID Number must be 13 digits')
  //   .required('ID Number is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  address: yup.string().required('Address is required'),
  wardNo: yup.string().required('Ward number is required'),
});

export default SignupValidationSchema;
