import * as yup from 'yup';

const CreateMissingPersonSchema = yup.object().shape({
  missinG_DATE: yup.date().required('Date is required'),
  missinG_TIME:  yup
  .string()
  .matches(/^((0?[1-9]|1[0-2]):([0-5][0-9]) ([AaPp][Mm]))$/, 'Invalid time format (hh:mm am/pm)').required('Time is required').required('Start Time is required'),
  location: yup.string().required('Location is required'),
  missingpersoN_DETAILS: yup.string().required('Details is required'),
  fulL_NAME: yup.string().required('Name is required'),
  // WARD_NO: yup.string().required('Ward number is required'),
});

export default CreateMissingPersonSchema;
