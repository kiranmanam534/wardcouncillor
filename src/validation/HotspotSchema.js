import * as yup from 'yup';

const HotspotValidationSchema = yup.object().shape({
  crimE_DATE: yup.date().required('Crime Date is required'),
  location: yup.string().required('Location Details is required'),
  crimE_DETAILS: yup.string().required('Crime Hotspot Details is required'),
  // expirY_DATE: yup.date().required('Epire Date is required'),
  // WARD_NO: yup.string().required('Ward number is required'),
  crimE_TYPE:yup.string().required('Crime Type is required'),
});
export default HotspotValidationSchema;
