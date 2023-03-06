import { useFormik } from "formik"
import * as Yup from "yup"
import Button from "../../../../components/Button"
import Form from "../../../../components/Form"
import Input from "../../../../components/Input"

const CountyForm = ({handleSubmit, buttonText, county, country, countries}) => {

  const formik = useFormik({
    initialValues:{
      country: (country ? country.id : ''),
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

    onSubmit:handleSubmit,
    //onSubmit: () => {formik.resetForm()},
  })
  

  return (
    <Form handleSubmit={formik.handleSubmit} classes='h-60'>
      <section className="">
        <label htmlFor="country">
          {formik.touched.country && formik.errors.country 
            ? formik.errors.country
            : ''
          }
        </label>
        <select 
          name="country" 
          id="country"
          value={formik.values.countryId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='text-gray-900 w-full font-bold bg-gray-300'
        >
          <option value=''>Selecteaza o tara</option>
          {countries.map(country => <option key={country.id} value={country.id} className='font-normal bg-gray-300 '>{country.name}</option>)}
        </select>
      </section>
    
      <section className="mb-2">
        <label htmlFor="county">
          {formik.touched.county && formik.errors.county 
          ? formik.errors.county
          : 'Nume Judet'}
        </label>
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