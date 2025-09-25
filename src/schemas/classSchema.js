import * as Yup from 'yup';

export const ClassSchema = Yup.object({
  className: Yup.string().required('Class Name is required'),
  classType: Yup.string().required('Class Type is required'),
});
