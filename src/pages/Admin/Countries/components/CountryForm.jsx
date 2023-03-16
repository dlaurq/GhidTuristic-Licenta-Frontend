import { useFormik } from "formik"
import * as Yup from "yup"
import Button from "../../../../components/Button"
import Form from "../../../../components/Form"
import Input from "../../../../components/Input"
import Label from "../../../../components/Label"

const CountryForm = ({handleSubmit, buttonText, country}) => {
    const formik = useFormik({
        initialValues:{
          country: (country ? country.name : ''),
          id: (country ? country.id : '')
        },
    
        validationSchema: Yup.object({
          country: Yup.string().max(60,"Numele tarii poate sa contina maxim 60 de caractere").required("Copletati campul").matches(/^[a-zA-Z\s]*$/, "Numele trebuie sa contina doar litere"),
        }),
    
        onSubmit:handleSubmit,
    })

  return (
    <Form handleSubmit={formik.handleSubmit} classes='h-52'>
      <section className="flex flex-col">
        <Label htmlFor="country" classes="mb-3">
          {formik.touched.country && formik.errors.country 
            ? formik.errors.country
            : 'Nume tara'
          }
        </Label>
        <Input 
          id="country" 
          name="country" 
          type="text" 
          placeholder="Nume tara"
          handleChange={formik.handleChange}
          value={formik.values.country}
          handleBlur={formik.handleBlur}
        />
      </section>
    
    <Button type="submit">{buttonText}</Button>
    
  </Form>
  )
}

export default CountryForm