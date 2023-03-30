import { useFormik } from "formik"
import * as Yup from "yup"
import Button from "../../../../components/Button"
import Form from "../../../../components/Form"
import Input from "../../../../components/Input"
import Select from "../../../../components/Select"
import Option from "../../../../components/Option"
import Label from "../../../../components/Label"

const LocationForm = ({handleSubmit, buttonText, location, cities}) => {
  const formik = useFormik({
    initialValues:{
      city: (location ? location.CityId : ''),
      location: (location ? location.address : ''),
      id: (location ? location.id : '')
    },

    validationSchema: Yup.object({
      location: Yup.string()
        .max(60,"Numele Locatiei poate sa contina maxim 60 de caractere")
        .required("Camp obligatoriul")
        .matches(/^[a-zA-Z\s]*$/, "Numele trebuie sa contina doar litere"),
      city: Yup.string()
        .required("Camp obligatoriul")
    }),

    onSubmit:handleSubmit,
    //onSubmit: () => {formik.resetForm()},
  })
  

  return (
    <Form handleSubmit={formik.handleSubmit} className='h-60'>
      <section>
        <Label htmlFor="city">
          {formik.touched.city && formik.errors.city 
            ? formik.errors.city
            : ''
          }
        </Label>
        <Select 
          name="city" 
          id="city"
          value={formik.values.city}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          className='text-gray-900 w-full font-bold bg-gray-300'
        >
          <Option value=''>Selecteaza un oras</Option>
          {cities.map(city => <Option key={city.id} value={city.id} className='font-normal bg-gray-300 '>{city.name}</Option>)}
        </Select>
      </section>
    
      <section className="mb-2">
        <Label htmlFor="location">
          {formik.touched.location && formik.errors.location 
          ? formik.errors.location
          : 'Nume locatie'}
        </Label>
        <Input 
          id="location" 
          name="location" 
          type="text" 
          placeholder="Nume locatie"
          handleChange={formik.handleChange}
          value={formik.values.location}
          handleBlur={formik.handleBlur}
        />
      </section>
    
      <Button type="submit">{buttonText}</Button>
    </Form>
  )
}

export default LocationForm