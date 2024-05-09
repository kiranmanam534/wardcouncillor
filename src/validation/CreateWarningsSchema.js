import * as yup from 'yup';

const CreateWarningsSchema = yup.object().shape({
  warninG_DATE: yup.date().required('Date is required'),
  warninG_TIME:  yup
  .string()
  .matches(/^((0?[1-9]|1[0-2]):([0-5][0-9]) ([AaPp][Mm]))$/, 'Invalid time format (hh:mm am/pm)').required('Time is required').required('Start Time is required'),
  location: yup.string().required('Location is required'),
  warninG_DETAILS: yup.string().required('Details is required'),
  typeofwarning: yup.string().required('Warning Type is required'),
  // WARD_NO: yup.string().required('Ward number is required'),
});

export default CreateWarningsSchema;
