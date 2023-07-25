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

const Cities = () => {
  const [cities ,setCities] = useState([])
  const [counties ,setCounties] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCities, setFilteredCities] = useState(cities)
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})

  const location = useLocation()
  const navigate = useNavigate()
  const api = useAxiosPrivate()

  useEffect(() =>{
    fetchCities()
    fetchCounties()
    setFilter(location?.state?.id)
  },[])

  const fetchCities = async () =>{
    try{
      const res = await api.get('/cities')
      setCities(res.data)
    }catch (err){
      //console.log(err)
    }
  }

  const fetchCounties = async () =>{
    try{
      const res = await api.get('/counties')
      setCounties(res.data)
    }catch (err){
      //console.log(err)
    }
  }

  const handleChange = (e) =>{
    setFilter(e.target.value)
  }

  const handleCreate = async (values) =>{
    try{
      const res = await api.post('/cities',{name:values.city, countyId:values.county})
      const newCities = [...cities, {...res.data.city}]
      setCities(newCities)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`/cities/${id}`)
      const newCities = cities.filter(city => city.id !== id)
      setCities(newCities)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`/cities/${values.id}`,{name:values.city,countyId:values.county})
      const newCities = cities.map(city => (city.id === values.id ? {...city, name:values.city, edit:false} : {...city}))
      setCities(newCities)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const handleEdit = async (id) => {
    const newCities = cities.map(city => (city.id === id ? {...city, edit:true} : {...city, edit:false}))
    setCities(newCities)
  }

  const toggleConfDelBox = (id)=>{
    const newCities = cities.map(city => city.id === id ? {...city, deleteBox:!city.deleteBox} : city)
    setCities(newCities)
  }

  const hideForm = () => {
    const newArr = cities.map(city => ({...city, edit: false}))
    setCities(newArr)
  }

  return (
    <section>

      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

      <DropDownForm 
        text='Adauga un oras' 
        form={<CityForm counties={counties} buttonText='Adauga' handleSubmit={handleCreate} />}
      />

      <hr />

      <Filtru 
        text='Filtreaza dupa Judet:'
        handleChange={handleChange}
        list={counties}
        placeholder='--Alege un Judet--'
        value={filter}
      />

      <hr />

      <SearchBar list={cities} setFilterList={setFilteredCities} compare='name' />

      <div className="p-2"></div>
      
      {/**LISTA ORASE */}
      {filteredCities.map(city => 
        <AdminItem 
          key={city.id}
          className={filter && city.CountyId !== filter && "hidden"}
          item={city}
          toggleConfDelBox={() => toggleConfDelBox(city.id)}
          handleDelete={() => handleDelete(city.id)} 
          handleNavigate={() => navigate('/admin/locatii', {state: {...city}})}
          subItemsLength={city?.Locations?.length}
          handleEdit={() => handleEdit(city.id)} 
          form={
            <CityForm 
              city={city}
              counties={counties}
              buttonText='Salvati'
              handleSubmit={handleUpdate}
              >
                <button className="sm:w-40 mt-5 md:w-60 lg:w-80" type="button" onClick={hideForm}>Cancel</button>
            </CityForm>}
        />
      )}

    </section>
  )
}


const CityForm = ({handleSubmit, buttonText, city, counties, children}) => {
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
    <form onSubmit={formik.handleSubmit} className=''>
      <section>
        <label htmlFor="county">
          {formik.touched.county && formik.errors.county 
            ? formik.errors.county
            : ''
          }
        </label>
        <select 
          name="county" 
          id="county"
          value={formik.values.county}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className=''
        >
          <option value=''>Selecteaza un judet</option>
          {counties.map(county => <option key={county.id} value={county.id} className=''>{county.name}</option>)}
        </select>
      </section>
    
      <section className="flex flex-col gap-2 mt-5">
        <label htmlFor="city">
          {formik.touched.city && formik.errors.city 
          ? formik.errors.city
          : 'Nume oras'}
        </label>
        <input 
          id="city" 
          name="city" 
          type="text" 
          placeholder="Nume oras"
          onChange={formik.handleChange}
          value={formik.values.city}
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

export default Cities