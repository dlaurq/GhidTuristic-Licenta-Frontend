import { useEffect, useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import ConfBox from "../../components/ConfBox"

const Countries = () => {
  const [countries, setCountries] = useState([])
  const [serverMsg, setServerMsg] = useState('')
  const [msgColor, setMsgColor] = useState('')
  const [delConfBox, setDelConfBox] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  
  
  useEffect(()=>{

    const fetchCountries = async () =>{
      try{
        const res = await axiosPrivate.get('/countries', {
        })
        console.log(res.data)
        const newCountries = res.data.map(country => ({...country, edit:false}))
        setCountries(newCountries)
        setServerMsg('')
      }catch (err){
        console.log(err)
        navigate('/login', { state: { from: location}, replace: true})
        setServerMsg(`Error: ${err.message}`)
      }
    }
  
    fetchCountries()


  },[])

  const handleCreate = async (values) => {
    try{
      const res = await axiosPrivate.post('/countries',{name:values.country})
      console.log(res.data)
      const newCountries = [...countries, {...res.data.country, edit:false}]
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      console.log(err.response)
      setServerMsg(`Error: ${err.response.data.message}`)
    }
    
  }

  const handleDelete = async (id) => {
    try{
      const res = await axiosPrivate.delete(`/countries/${id}`)
      const newCountries = countries.filter(country => country.id !== id)
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }finally{
      setDelConfBox(false)
    }
  }
  
  const handleUpdate = async (values) =>{
    console.log(values)
    try{
      const res = await axiosPrivate.patch(`/countries/${values.id}`,{name:values.country})
      const newCountries = countries.map(country => (country.id === values.id ? {...country, name:values.country, edit:false} : {...country}))
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-blue-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
    }
  }

  const handleEdit = async (id) => {
    const newCountries = countries.map(country => (country.id === id ? {...country, edit:true} : {...country, edit:false}))
    setCountries(newCountries)
    
  }

  const toggleConfDelBox = (id)=>{
    const newCountries = countries.map(country => country.id === id ? {...country, deleteBox:!country.deleteBox} : country)
    setCountries(newCountries)
  }


  

  return (
    <section className="bg-gray-900">
      
      <ErrorMsg color={msgColor ? msgColor : "text-gray-300"}>{serverMsg ? serverMsg : "Adauga o tara"}</ErrorMsg>
      <CountryForm handleSubmit={handleCreate} buttonText='Adauga'/>

      {countries.map(country =>
        <Country 
          toggleConfDelBox={() => toggleConfDelBox(country.id)}
          delConfBox={delConfBox}
          country={country} 
          handleDelete={() => handleDelete(country.id)} 
          handleEdit={() => handleEdit(country.id)} 
          handleUpdate={handleUpdate}
          key={country.id}
        />
      )}

    </section>
  )
}


const Country = ({country, handleDelete, handleEdit,handleUpdate, toggleConfDelBox}) => {

  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/County', {state: {...country}})
  }

  return (
    <>
    {!country.edit ?
        <section className="flex flex-row justify-between p-5 items-center border-b border-gray-300">
          {country.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick}  className="text-2xl text-gray-300 break-all">{country.name} ({country?.Counties?.length || 0})</h3>
          <div className="buttons">
            <button onClick={handleEdit} className='mx-1'>Edit</button>
            <button onClick={toggleConfDelBox} className='mx-1'>Delete</button>
          </div>
        </section>
      :
      <CountryForm buttonText='Edit' handleSubmit={handleUpdate} country={country}/>}
  </>
  )
}



const CountryForm = ({handleSubmit, buttonText, country}) => {
  const formik = useFormik({
      initialValues:{
        country: (country ? country.name : ''),
        id: (country ? country.id : '')
      },
  
      validationSchema: Yup.object({
        country: Yup.string().max(60,"Numele tarii poate sa contina maxim 60 de caractere").required("Copletati campul").matches(/^[a-zA-Z\s]*$/, "Numele trebuie sa contina doar litere"),
      }),
  
      onSubmit: (values) => {
        handleSubmit(values)
        formik.resetForm()
      },
  })

return (
  <form onSubmit={formik.handleSubmit} className='h-52'>
    <section className="flex flex-col">
      <label htmlFor="country" className="mb-3">
        {formik.touched.country && formik.errors.country 
          ? formik.errors.country
          : 'Nume tara'
        }
      </label>
      <input 
        id="country" 
        name="country" 
        type="text" 
        placeholder="Nume tara"
        onChange={formik.handleChange}
        value={formik.values.country}
        onBlur={formik.handleBlur}
      />
    </section>
  
  <button className="mt-5" type="submit">{buttonText}</button>
  
</form>
)
}

export default Countries