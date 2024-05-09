import * as yup from 'yup';

const HotspotValidationSchema = yup.object().shape({
  crimE_DATE: yup.date().required('Crime Date is required'),
  location: yup.string().required('Loction Details is required'),
  crimE_DETAILS: yup.string().required('Crime Hotspot Details is required'),
  expirY_DETAILS: yup.date().required('Epire Date is required'),
  WARD_NO: yup.string().required('Ward number is required'),
});

export default HotspotValidationSchema;
