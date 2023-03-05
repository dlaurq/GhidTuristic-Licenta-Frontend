import { useFormik } from "formik"
import * as Yup from "yup"
import Button from "../../../../components/Button"

const CountryForm = ({handleSubmit, buttonText, country}) => {
    const formik = useFormik({
        initialValues:{
          country: (country ? country.name : ''),
          id: (country ? country.id : '')
        },
    
        validationSchema: Yup.object({
          country: Yup.string().max(60,"Numele tarii poate sa contina maxim 60").required("Copletati campul").matches(/^[a-zA-Z\s]*$/, "Numele trebuie sa contina doar litere"),
        }),
    
        onSubmit:handleSubmit,
        //onSubmit: () => {formik.resetForm()},
    })

  return (
    <form onSubmit={formik.handleSubmit} autoComplete='off' className="text-slate-300 text-xl font-bold p-3 border-zinc-800 border-2 w-full text-center">
    <label htmlFor="country">Nume tara</label>
    <input 
      className="text-neutral-700 m-5"
      id="country" 
      name="country" 
      type="text" 
      placeholder="Nume tara"
      onChange={formik.handleChange}
      value={formik.values.country}
      onBlur={formik.handleBlur}
    />
    <Button type="submit">{buttonText}</Button>
    {formik.touched.country && formik.errors.country ? (
     <div>{formik.errors.country}</div>
   ) : null}
  </form>
  )
}

export default CountryForm