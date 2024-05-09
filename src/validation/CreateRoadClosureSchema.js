import * as yup from 'yup';

const CreateRoadClosureScrema = yup.object().shape({
  roadclouseR_STARTDATE: yup.date().required('Start Date is required'),
  roadclouseR_STARTTIME: yup
    .string()
    .matches(/^((0?[1-9]|1[0-2]):([0-5][0-9]) ([AaPp][Mm]))$/, 'Invalid time format (hh:mm am/pm)').required('Start Time is required'),
  roadclouseR_ENDDATE: yup.date().required('End Date is required'),
  roadclouseR_ENDTIME: yup
    .string()
    .matches(/^((0?[1-9]|1[0-2]):([0-5][0-9]) ([AaPp][Mm]))$/, 'Invalid time format (hh:mm am/pm)').required('End Time is required'),
  location: yup.string().required('Location is required'),
  roaD_NAME: yup.string().required('Road Name is required'),
  roadclouseR_DETAILS: yup.string().required('Details is required'),
  // expirY_DETAILS: yup.date().required('Epire Date is required'),
  // WARD_NO: yup.string().required('Ward number is required'),
});

export default CreateRoadClosureScrema;
