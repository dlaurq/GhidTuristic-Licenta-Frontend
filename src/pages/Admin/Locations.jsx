import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import Filtru from '../../components/FIltru'
import ErrorMsg from '../../components/ErrorMsg'
import AdminItem from '../../components/AdminItem'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import SearchBar from '../../components/SearchBar'

const Locations = () => {
  const [cities ,setCities] = useState([])
  const [locations ,setLocations] = useState([])
  const [filter, setFilter] = useState('')
  const [geo, setGeo] = useState({})
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})
  const [filteredLocations, setFilteredLocations] = useState(locations)

  const api = useAxiosPrivate()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() =>{
    fetchCities()
    fetchLocations()
    fetchGeo()
    setFilter(location?.state?.id)
  },[])

  const fetchGeo = async () => {
    try{
      const res = await api.get('/geo')
      setGeo(res.data)
    }catch(err){
      //console.log(err)
    }
    
}

  const fetchCities = async () =>{
    try{
      const res = await api.get('/cities')
      setCities(res.data)
    }catch (err){
      //console.log(err)
    }
  }

  const fetchLocations = async () =>{
    try{
      const res = await api.get('/locations')
      setLocations(res.data)
      setFilteredLocations(res.data)
    }catch (err){
      //console.log(err)
    }
  }

  const handleChange = (e) =>{
    setFilter(e.target.value)
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`/locations/${id}`)
      const newLocations = locations.filter(location => location.id !== id)
      setLocations(newLocations)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`/locations/${values.id}`,{address: values.address, city:values.city})
      const newLocations = locations.map(location => (location.id === values.id ? {...location, address:values.address, edit:false} : {...location}))
      setLocations(newLocations)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const handleEdit = async (id) => {
    const newLocations = locations.map(location => (location.id === id ? {...location, edit:true} : {...location, edit:false}))
    setLocations(newLocations)
  }

  const toggleConfDelBox = (id)=>{
    const newLocations = locations.map(location => location.id === id ? {...location, deleteBox:!location.deleteBox} : location)
    setLocations(newLocations)
  }

  const hideForm = () => {
    const newArr = locations.map(lcoation => ({...lcoation, edit: false}))
    setLocations(newArr)
  }

  return (
    <section>

      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

      <Filtru 
        text='Filtreaza dupa Oras:'
        handleChange={handleChange}
        list={cities}
        placeholder='--Alege un Oras--'
        value={filter}
      />

      <hr />

      <SearchBar list={locations} setFilterList={setFilteredLocations} compare='address' />

      <div className="p-2"></div>
      
      {/**LISTA ADRESE */}
      {filteredLocations.map(location => 
        <AdminItem 
        key={location.id}
        className={filter && location.CityId !== filter && "hidden"}
        item={location}
        toggleConfDelBox={() => toggleConfDelBox(location.id)}
        handleDelete={() => handleDelete(location.id)} 
        handleNavigate={() => navigate('/admin/orase', {state: {...location}})}
        subItemsLength={location?.Users[0]?.username || location?.Places[0]?.name || ' '}
        handleEdit={() => handleEdit(location.id)} 
        form={
          <LocationForm 
            location={location}
            cities={cities}
            buttonText='Salvati'
            handleSubmit={handleUpdate}
            geo={geo}
            hideForm={hideForm}
          />
          }
      />
      )}

          

    </section>
  )
}

const LocationForm = ({handleSubmit, buttonText, location, geo, hideForm}) => {
  const formik = useFormik({
    initialValues:{
      country: location?.City?.County?.Country?.id || '',
      county: location?.City?.County?.id || '',
      city: location?.City?.id || '',
      address: location?.address || '',
      id: location?.id || ''
    },

    validationSchema: Yup.object({
      address: Yup.string()
        .max(60,"Numele Locatiei poate sa contina maxim 60 de caractere")
        .required("Camp obligatoriul")
        .matches(/^[a-zA-Z\s]*$/, "Numele trebuie sa contina doar litere"),
      country: Yup.string().required("Camp obligatoriul"),
      county: Yup.string().required("Camp obligatoriul"),
      city: Yup.string().required("Camp obligatoriul"),
    }),

    onSubmit:handleSubmit,
    //onSubmit: () => {formik.resetForm()},
  })
  

  return (
    <form onSubmit={formik.handleSubmit} className=''>

      <section className="flex flex-col gap-1 mb-3">
            <label htmlFor="country">
                {formik.touched.country && formik.errors.country 
                    ? formik.errors.country
                    : 'Tara'
            }</label>
            <select 
                className=""
                name="country" 
                id="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            >
                    <option value="">Selectati o tara</option>
                    {geo?.countries?.map( country => <option key={country.id} value={country.id}>{country.name}</option>)}
            </select>
        </section>

        <section className="flex flex-col gap-1 my-3">
            <label htmlFor="county">
                {formik.touched.county && formik.errors.county 
                    ? formik.errors.county
                    : 'Judet'
            }</label>
            <select 
                className=""
                name="county" 
                id="county"
                value={formik.values.county}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            >
                <option value="">Selectati un judet</option>
                {geo?.counties?.filter( county => county.CountryId === formik.values.country).map( county => <option key={county.id} value={county.id}>{county.name}</option>)}
            </select>
        </section>

        <section className="flex flex-col gap-1 my-3">
            <label htmlFor="city">
                {formik.touched.city && formik.errors.city 
                    ? formik.errors.city
                    : 'Oras'
            }</label>
            <select 
                className=""
                name="city" 
                id="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            >
                <option value="">Selectati un oras</option>
                {geo?.cities?.filter( city => city.CountyId === formik.values.county).map( city => <option key={city.id} value={city.id}>{city.name}</option>)}
            </select>
        </section>
    
      <section className="flex flex-col gap-1 my-3">
        <label htmlFor="address">
          {formik.touched.address && formik.errors.address 
          ? formik.errors.address
          : 'Nume locatie'}
        </label>
        <input 
          id="address" 
          name="address" 
          type="text" 
          placeholder="Nume locatie"
          onChange={formik.handleChange}
          value={formik.values.address}
          onBlur={formik.handleBlur}
        />
      </section>
    
      <section className="flex flex-col justify-between sm:flex-row lg:justify-start lg:gap-32">
        <button className=" sm:w-40 mt-5 md:w-60 lg:w-80" type="submit">{buttonText}</button>
        <button className="sm:w-40 mt-5 md:w-60 lg:w-80" type="button" onClick={hideForm}>Cancel</button>
      </section>
    </form>
  )
}

export default Locations