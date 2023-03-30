import { useFormik } from "formik"
import * as Yup from "yup"
import Button from "../../../../components/Button"
import Form from "../../../../components/Form"
import Input from "../../../../components/Input"
import Select from "../../../../components/Select"
import Option from "../../../../components/Option"
import Label from "../../../../components/Label"

const CityForm = ({handleSubmit, buttonText, city, counties}) => {
  const formik = useFormik({
    initialValues:{
      county: (city ? city.CountyId : ''),
      city: (city ? city.name : ''),
      id: (city ? city.id : '')
    },

    validationSchema: Yup.object({
      city: Yup.string()
        .max(60,"Numele orasului poate sa contina maxim 60 de caractere")
        .required("Camp obligatoriul")
        .matches(/^[a-zA-Z\s]*$/, "Numele trebuie sa contina doar litere"),
      county: Yup.string()
        .required("Camp obligatoriul")
    }),

    onSubmit: (values) => {
      handleSubmit(values)
      formik.resetForm()
    },
  })
  

  return (
    <Form handleSubmit={formik.handleSubmit} className='h-60'>
      <section>
        <Label htmlFor="county">
          {formik.touched.county && formik.errors.county 
            ? formik.errors.county
            : ''
          }
        </Label>
        <Select 
          name="county" 
          id="county"
          value={formik.values.county}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          className='text-gray-900 w-full font-bold bg-gray-300'
        >
          <Option value=''>Selecteaza un judet</Option>
          {counties.map(county => <Option key={county.id} value={county.id} className='font-normal bg-gray-300 '>{county.name}</Option>)}
        </Select>
      </section>
    
      <section className="mb-2">
        <Label htmlFor="city">
          {formik.touched.city && formik.errors.city 
          ? formik.errors.city
          : 'Nume oras'}
        </Label>
        <Input 
          id="city" 
          name="city" 
          type="text" 
          placeholder="Nume oras"
          handleChange={formik.handleChange}
          value={formik.values.city}
          handleBlur={formik.handleBlur}
        />
      </section>
    
      <Button type="submit">{buttonText}</Button>
    </Form>
  )
}

export default CityForm