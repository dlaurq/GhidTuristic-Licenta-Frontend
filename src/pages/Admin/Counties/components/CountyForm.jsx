import { useFormik } from "formik"
import * as Yup from "yup"
import Button from "../../../../components/Button"
import Form from "../../../../components/Form"
import Input from "../../../../components/Input"
import Select from "../../../../components/Select"
import Option from "../../../../components/Option"
import Label from "../../../../components/Label"

const CountyForm = ({handleSubmit, buttonText, county, country, countries}) => {
  const formik = useFormik({
    initialValues:{
      country: (county ? county.CountryId : ''),
      county: (county ? county.name : ''),
      id: (county ? county.id : '')
    },

    validationSchema: Yup.object({
      county: Yup.string()
        .max(60,"Numele tarii poate sa contina maxim 60")
        .required("Camp obligatoriul")
        .matches(/^[a-zA-Z\s]*$/, "Numele trebuie sa contina doar litere"),
      country: Yup.string()
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
        <Label htmlFor="country">
          {formik.touched.country && formik.errors.country 
            ? formik.errors.country
            : ''
          }
        </Label>
        <Select 
          name="country" 
          id="country"
          value={formik.values.country}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          className='text-gray-900 w-full font-bold bg-gray-300'
        >
          <Option value=''>Selecteaza o tara</Option>
          {countries.map(country => <Option key={country.id} value={country.id} className='font-normal bg-gray-300 '>{country.name}</Option>)}
        </Select>
      </section>
    
      <section className="mb-2">
        <Label htmlFor="county">
          {formik.touched.county && formik.errors.county 
          ? formik.errors.county
          : 'Nume Judet'}
        </Label>
        <Input 
          id="county" 
          name="county" 
          type="text" 
          placeholder="Nume judet"
          handleChange={formik.handleChange}
          value={formik.values.county}
          handleBlur={formik.handleBlur}
        />
      </section>
    
      <Button type="submit">{buttonText}</Button>
    </Form>
  )
}

export default CountyForm