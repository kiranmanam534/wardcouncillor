import * as yup from 'yup';

const CreateMeetingScrema = yup.object().shape({
  meetinG_STARTDATE: yup.date().required('Start Date is required'),
  meetinG_STARTTIME:  yup
  .string()
  .matches(/^((0?[1-9]|1[0-2]):([0-5][0-9]) ([AaPp][Mm]))$/, 'Invalid time format (hh:mm am/pm)').required('Start Time is required').required('Start Time is required'),
  meetinG_ENDDATE: yup.date().required('End Date is required'),
  meetinG_ENDTIME:  yup
  .string()
  .matches(/^((0?[1-9]|1[0-2]):([0-5][0-9]) ([AaPp][Mm]))$/, 'Invalid time format (hh:mm am/pm)').required('Start Time is required').required('End Time is required'),
  location: yup.string().required('Location is required'),
  subject: yup.string().required('subject is required'),
  meetinG_DETAILS: yup.string().required('Details is required'),
  // expirY_DETAILS: yup.date().required('Epire Date is required'),
  // WARD_NO: yup.string().required('Ward number is required'),
});

export default CreateMeetingScrema;
