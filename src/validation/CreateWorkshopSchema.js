import * as yup from 'yup';

const CreateWorkshopScrema = yup.object().shape({
  workshoP_STARTDATE: yup.date().required('Start Date is required'),
  workshoP_STARTTIME:  yup
  .string()
  .matches(/^((0?[1-9]|1[0-2]):([0-5][0-9]) ([AaPp][Mm]))$/, 'Invalid time format (hh:mm am/pm)').required('Start Time is required').required('Start Time is required'),
  workshoP_ENDDATE: yup.date().required('End Date is required'),
  workshoP_ENDTIME:  yup
  .string()
  .matches(/^((0?[1-9]|1[0-2]):([0-5][0-9]) ([AaPp][Mm]))$/, 'Invalid time format (hh:mm am/pm)').required('Start Time is required').required('End Time is required'),
  location: yup.string().required('Location is required'),
  workshoP_DETAILS: yup.string().required('Details is required'),
  // expirY_DETAILS: yup.date().required('Epire Date is required'),
  // WARD_NO: yup.string().required('Ward number is required'),
});

export default CreateWorkshopScrema;
