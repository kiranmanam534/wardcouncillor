import * as yup from 'yup';

const HealthCareValidationSchema = yup.object().shape({
  healthcarE_DATE: yup.date().required('Date is required'),
  location: yup.string().required('Loction Details is required'),
  healthcarE_DETAILS: yup.string().required('HealthCare Details is required'),
});
export default HealthCareValidationSchema;
