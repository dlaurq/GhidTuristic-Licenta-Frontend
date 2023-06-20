import { useEffect, useState } from "react"
import ErrorMsg from "../../components/ErrorMsg"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import DropDownForm from "../../components/DropDownForm"
import AdminItem from "../../components/AdminItem"
import SearchBar from "../../components/SearchBar"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"


const Countries = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})
  
  const navigate = useNavigate()
  const api = useAxiosPrivate()
  
  useEffect(()=>{

    const fetchCountries = async () =>{
      try{
        const res = await api.get('/countries')
        const newCountries = res.data.map(country => ({...country, edit:false}))
        setCountries(newCountries)
      }catch (err){
        setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
      }
    }
  
    fetchCountries()
  },[])

  const handleCreate = async (values) => {
    try{
      const res = await api.post('/countries',{name:values.country})
      const newCountries = [...countries, {...res.data.country, edit:false}]
      setCountries(newCountries)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`/countries/${id}`)
      const newCountries = countries.filter(country => country.id !== id)
      setCountries(newCountries)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`/countries/${values.id}`,{name:values.country})
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
    <section>
      
      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

      <DropDownForm 
        text='Adauga o tara' 
        form={<CountryForm handleSubmit={handleCreate} buttonText='Adauga'/>}
      />

      <hr />

      <SearchBar list={countries} setFilterList={setFilteredCountries} compare='name' />

      <div className="p-2"></div>

      {/**LISTA TARI */}
      {filteredCountries.map(country =>
        <AdminItem 
          key={country.id}
          item={country}
          toggleConfDelBox={() => toggleConfDelBox(country.id)}
          handleDelete={() => handleDelete(country.id)} 
          handleNavigate={() => navigate('/admin/judete', {state: {...country}})}
          subItemsLength={country?.Counties?.length}
          handleEdit={() => handleEdit(country.id)} 
          form={
            <CountryForm buttonText='Edit' handleSubmit={handleUpdate} country={country}>
              <button className="sm:w-40 mt-5 md:w-60 lg:w-80" type="button" onClick={hideForm}>Cancel</button>
            </CountryForm>
          }

        />
      )}

    </section>
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
    <form onSubmit={formik.handleSubmit} className='  bg-gray-900'>
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
          className="lg:w-80"
        />
      </section>
    
      <section className="flex flex-col justify-between sm:flex-row lg:justify-start lg:gap-32">
        <button className=" sm:w-40 mt-5 md:w-60 lg:w-80" type="submit">{buttonText}</button>
        {children}
      </section>
    
    </form>
  )
}

export default Countries