import { useEffect, useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import ConfBox from "../../components/ConfBox"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faPenToSquare, faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

const Countries = () => {
  const [countries, setCountries] = useState([])
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})
  const [delConfBox, setDelConfBox] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const [showForm, setShowForm] = useState(false)

  
  
  useEffect(()=>{

    const fetchCountries = async () =>{
      try{
        const res = await axiosPrivate.get('/countries')
        const newCountries = res.data.map(country => ({...country, edit:false}))
        setCountries(newCountries)
      }catch (err){
        console.log(err)
      }
    }
  
    fetchCountries()

  },[])

  const handleCreate = async (values) => {
    try{
      const res = await axiosPrivate.post('/countries',{name:values.country})
      const newCountries = [...countries, {...res.data.country, edit:false}]
      setCountries(newCountries)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      console.log(err.response)
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
    
  }

  const handleDelete = async (id) => {
    try{
      const res = await axiosPrivate.delete(`/countries/${id}`)
      const newCountries = countries.filter(country => country.id !== id)
      setCountries(newCountries)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
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
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
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

  const hideForm = () => {
    const newArr = countries.map(country => ({...country, edit: false}))
    setCountries(newArr)
  }
  

  return (
    <section className="bg-gray-900">
      
      
      <section className="">
        <section 
          onClick={() => setShowForm(prev => !prev)} 
          className="sm:px-16 md:px-28 px-5 py-3 text-white flex flex-row justify-between items-center text-2xl">
          <p className="">Adauga o tara</p>
          <FontAwesomeIcon icon={showForm ? faCaretDown : faCaretUp} />
        </section>
        {showForm && <CountryForm handleSubmit={handleCreate} buttonText='Adauga'/>}
      </section>

      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}
        <section className="md:grid md:grid-cols-2 md:auto-rows-fr">
          {countries.map(country =>
            <Country 
              toggleConfDelBox={() => toggleConfDelBox(country.id)}
              delConfBox={delConfBox}
              country={country} 
              handleDelete={() => handleDelete(country.id)} 
              handleEdit={() => handleEdit(country.id)} 
              handleUpdate={handleUpdate}
              key={country.id}
              hideForm={hideForm}
            />
          )}
        </section>
     

    </section>
  )
}


const Country = ({country, handleDelete, handleEdit,handleUpdate, toggleConfDelBox, hideForm}) => {

  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/judete', {state: {...country}})
  }

  return (
    <>
    {!country.edit ?
        <section className="sm:px-16  md:border-2 flex flex-row justify-between p-5 items-center text-gray-900 bg-white border-gray-900 border-b-2">
          {country.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 
            onClick={handleClick}  
            className="text-2xl break-all"
          >
              {country.name} ({country?.Counties?.length || 0})
          </h3>
          <section className=" text-3xl flex flex-row justify-between items-center gap-5">
            <FontAwesomeIcon icon={faPenToSquare} className='cursor-pointer pl-5' onClick={handleEdit}/>
            <FontAwesomeIcon icon={faX} className='cursor-pointer' onClick={toggleConfDelBox}/>
          </section>
        </section>
      :
      <CountryForm buttonText='Edit' handleSubmit={handleUpdate} country={country}>
         <button className="mt-5" type="button" onClick={hideForm}>Cancel</button>
      </CountryForm>}
  </>
  )
}



const CountryForm = ({handleSubmit, buttonText, country, children}) => {
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
  <form onSubmit={formik.handleSubmit} className='sm:px-16 md:px-28'>
    <section className="flex flex-col">
      <label htmlFor="country" className="mb-3 text-white">
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
        className="w-2/5"
      />
    </section>
  
  <section className="flex flex-col justify-between">
    <button className="mt-5 w-2/5" type="submit">{buttonText}</button>
    {children}
  </section>
  
</form>
)
}

export default Countries