import React, { useEffect, useState } from 'react'
import ErrorMsg from '../../components/ErrorMsg'
import { useLocation } from 'react-router-dom'
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import DropDownForm from "../../components/DropDownForm"
import Filtru from '../../components/Filtru'
import SearchBar from '../../components/SearchBar'
import AdminItem from '../../components/AdminItem'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Counties = () => {
  const [countries ,setCountries] = useState([])
  const [counties ,setCounties] = useState([])
  const [filter, setFilter] = useState('')
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})
  const [filteredCounties, setFilteredCounties] = useState(counties)

  const location = useLocation()
  const navigate = useNavigate()
  const api = useAxiosPrivate()

  useEffect(() =>{
    fetchCountries()
    fetchCounties()
    setFilter(location?.state?.id)
  },[])

  const fetchCountries = async () =>{
    try{
      const res = await api.get('/countries')
      setCountries(res.data)
    }catch (err){
    }
  }

  const fetchCounties = async () =>{
    try{
      const res = await api.get('/counties')
      setCounties(res.data)
    }catch (err){
    }
  }

  const handleChange = (e) =>{
    setFilter(e.target.value)
    
  }

  const handleCreate = async (values) =>{
    try{
      const res = await api.post('/counties',{name:values.county, countryId:values.country})
      const newCounties = [...counties, {...res.data.county}]
      setCounties(newCounties)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`/counties/${id}`)
      const newCounties = counties.filter(county => county.id !== id)
      setCounties(newCounties)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`/counties/${values.id}`,{name:values.county,countryId:values.country})
      const newCounties = counties.map(county => (county.id === values.id ? {...county, name:values.county, edit:false} : {...county}))
      setCounties(newCounties)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const handleEdit = async (id) => {
    const newCounties = counties.map(county => (county.id === id ? {...county, edit:true} : {...county, edit:false}))
    setCounties(newCounties)
  }

  const toggleConfDelBox = (id)=>{
    const newCounties = counties.map(county => county.id === id ? {...county, deleteBox:!county.deleteBox} : county)
    setCounties(newCounties)
  }

  const hideForm = () => {
    const newArr = counties.map(county => ({...county, edit: false}))
    setCounties(newArr)
  }

  return (
    <section>

      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}
      
      

      <DropDownForm 
        text='Adauga un judet' 
        form={<CountyForm countries={countries} buttonText='Adauga' handleSubmit={handleCreate}/>}
      />

      <hr />

      <Filtru 
        text='Filtreaza dupa tara:'
        handleChange={handleChange}
        list={countries}
        placeholder='--Alege un tara--'
        value={filter}
      />

      <hr />

      <SearchBar list={counties} setFilterList={setFilteredCounties} compare='name' />

      <div className="p-2"></div>

     
      <section className='bg-white'>
        {filteredCounties.map(county => 
          <AdminItem 
            key={county.id}
            className={filter && county.CountryId !== filter && "hidden"}
            item={county}
            toggleConfDelBox={() => toggleConfDelBox(county.id)}
            handleDelete={() => handleDelete(county.id)} 
            handleNavigate={() => navigate('/admin/orase', {state: {...county}})}
            subItemsLength={county?.Cities?.length}
            handleEdit={() => handleEdit(county.id)} 
            form={
              <CountyForm 
                county={county}
                countries={countries}
                buttonText='Salvati'
                handleSubmit={handleUpdate}
              >
                <button className="sm:w-40 mt-5 md:w-60 lg:w-80" type="button" onClick={hideForm}>Cancel</button>
              </CountyForm>}
          />
        )}
      </section>

      

    </section>
  )
}

const CountyForm = ({handleSubmit, buttonText, county, country, countries, children}) => {
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
    <form onSubmit={formik.handleSubmit} className=''>
      <section className='flex flex-col gap-2'>
        <label htmlFor="country">
          {formik.touched.country && formik.errors.country 
            ? formik.errors.country
            : ''
          }
        </label>
        <select 
          name="country" 
          id="country"
          value={formik.values.country}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='text-gray-900 font-bold bg-white'
        >
          <option value=''>Selecteaza o tara</option>
          {countries.map(country => <option key={country.id} value={country.id} className='  '>{country.name}</option>)}
        </select>
      </section>
    
      <section className="flex flex-col gap-2 mt-5">
        <label htmlFor="county">
          {formik.touched.county && formik.errors.county 
          ? formik.errors.county
          : 'Nume Judet'}
        </label>
        <input 
          id="county" 
          name="county" 
          type="text" 
          placeholder="Nume judet"
          onChange={formik.handleChange}
          value={formik.values.county}
          onBlur={formik.handleBlur}
        />
      </section>
    
      <section className="flex flex-col justify-between sm:flex-row lg:justify-start lg:gap-32">
        <button className=" sm:w-40 mt-5 md:w-60 lg:w-80" type="submit">{buttonText}</button>
        {children}
      </section>
    </form>
  )
}



export default Counties