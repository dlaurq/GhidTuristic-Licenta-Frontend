import React, { useEffect, useState } from 'react'
import api from "../../api/axios"
import { useLocation } from 'react-router-dom'
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import ConfBox from '../../components/ConfBox'

const Locations = () => {
  const [cities ,setCities] = useState([])
  const [locations ,setLocations] = useState([])
  const [filter, setFilter] = useState('')
  const [serverMsg, setServerMsg] = useState()
  const [msgColor, setMsgColor] = useState('')

  const location = useLocation()

  useEffect(() =>{
    fetchCities()
    fetchLocations()
    setFilter(location?.state?.id)
  },[])

  const fetchCities = async () =>{
    try{
      const res = await api.get('api/cities')
      setCities(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const fetchLocations = async () =>{
    try{
      const res = await api.get('api/locations')
      setLocations(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const handleChange = (e) =>{
    setFilter(e.target.value)
  }

  const handleCreate = async (values) =>{
    console.log(values)
    try{
      const res = await api.post('api/locations',{address:values.location, cityId:values.city})
      console.log(res.data)
      const newLocations = [...locations, {...res.data.location}]
      setLocations(newLocations)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.message}`)
      setMsgColor('text-red-500')
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`api/locations/${id}`)
      const newLocations = locations.filter(location => location.id !== id)
      setLocations(newLocations)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`api/locations/${values.id}`,{address:values.location,cityId:values.city})
      const newLocations = locations.map(location => (location.id === values.id ? {...location, address:values.location, edit:false} : {...location}))
      setLocations(newLocations)
      setServerMsg(res.data.message)
      setMsgColor('text-blue-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
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

  return (
    <section className='bg-gray-900 text-gray-300'>

      <section className="flex flex-row justify-between items-center p-5 text-xl border-b font-medium">
        <p>Filtreaza dupa Oras:</p>
        <select name="locationSelector" id="locationSelector" onChange={handleChange} className='text-gray-900' value={filter}>
          <option value="">--Alege un Oras--</option>
          {cities.map(city => 
            <option 
              key={city.id} 
              value={city.id}
            >
              {city.name}
            </option>
          )}
        </select>
      </section>
      
      {/** 
      <ErrorMsg color={msgColor}>{serverMsg ? serverMsg : "Adauga o adresa"}</ErrorMsg>
      
        <LocationForm 
          cities={cities}
          buttonText='Adauga'
          handleSubmit={handleCreate}
        />
      */}
      {locations.map(location => 
        <Location 
          key={location.id} 
          toggleConfDelBox={() => toggleConfDelBox(location.id)}
          handleEdit={() => handleEdit(location.id)} 
          location={location} 
          handleDelete={() => handleDelete(location.id)}
          handleUpdate={handleUpdate}
          cities={cities}
          className={filter && location.CityId !== filter && "hidden"}
        />
      )}

    </section>
  )
}


const Location = ({location, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, cities, className}) => {
  
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/admin/${location?.Users[0]?.username ? 'Users' : 'entities'}`, {state: {search: (location?.Users[0]?.username || location?.Places[0]?.name)}})
  }

  return (
    <>{!location.edit 
      ?<section className={`flex flex-row justify-between p-5 items-center border-b border-gray-300 ${className}`}>
        {location.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick} className="text-2xl break-all">{location.address} ({location?.Users[0]?.username || location?.Places[0]?.name || ' '})</h3>
          <div className="flex flex-row">
            {/** 
              <Button handleClick={handleEdit} className='mx-1'>Edit</Button>
            */}
              <button onClick={toggleConfDelBox} className='mx-1'>Delete</button>
          </div>
      </section>

      :<LocationForm 
      location={location}
      cities={cities}
      buttonText='Salvati'
      handleSubmit={handleUpdate}
      />}
    </>
  )
}



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
    <form onSubmit={formik.handleSubmit} className='h-60'>
      <section>
        <label htmlFor="city">
          {formik.touched.city && formik.errors.city 
            ? formik.errors.city
            : ''
          }
        </label>
        <select 
          name="city" 
          id="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className='text-gray-900 w-full font-bold bg-gray-300'
        >
          <option value=''>Selecteaza un oras</option>
          {cities.map(city => <option key={city.id} value={city.id} className='font-normal bg-gray-300 '>{city.name}</option>)}
        </select>
      </section>
    
      <section className="mb-2">
        <label htmlFor="location">
          {formik.touched.location && formik.errors.location 
          ? formik.errors.location
          : 'Nume locatie'}
        </label>
        <input 
          id="location" 
          name="location" 
          type="text" 
          placeholder="Nume locatie"
          onChange={formik.handleChange}
          value={formik.values.location}
          onBlur={formik.handleBlur}
        />
      </section>
    
      <button type="submit">{buttonText}</button>
    </form>
  )
}

export default Locations