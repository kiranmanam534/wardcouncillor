import * as yup from 'yup';

const WardsComparisionSchema = yup.object().shape({
    ward1: yup.number().typeError('Only numbers are allowed').required('Ward number1 is required'),
    ward2: yup.number().typeError('Only numbers are allowed').required('Ward number2 is required'),
});
export default WardsComparisionSchema;
