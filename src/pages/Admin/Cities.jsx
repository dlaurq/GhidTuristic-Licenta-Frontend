import React, { useEffect, useState } from 'react'
import api from "../../api/axios"
import ErrorMsg from '../../components/ErrorMsg'
import { useLocation } from 'react-router-dom'
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import ConfBox from '../../components/ConfBox'

const Cities = () => {
  const [cities ,setCities] = useState([])
  const [counties ,setCounties] = useState([])
  const [filter, setFilter] = useState('')
  const [serverMsg, setServerMsg] = useState()
  const [msgColor, setMsgColor] = useState('')

  const location = useLocation()

  useEffect(() =>{
    fetchCities()
    fetchCounties()
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

  const fetchCounties = async () =>{
    try{
      const res = await api.get('api/counties')
      setCounties(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const handleChange = (e) =>{
    setFilter(e.target.value)
  }

  const handleCreate = async (values) =>{
    try{
      const res = await api.post('api/cities',{name:values.city, countyId:values.county})
      const newCities = [...cities, {...res.data.city}]
      setCities(newCities)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.message}`)
      setMsgColor('text-red-500')
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`api/cities/${id}`)
      const newCities = cities.filter(city => city.id !== id)
      setCities(newCities)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`api/cities/${values.id}`,{name:values.city,countyId:values.county})
      const newCities = cities.map(city => (city.id === values.id ? {...city, name:values.city, edit:false} : {...city}))
      setCities(newCities)
      setServerMsg(res.data.message)
      setMsgColor('text-blue-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
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

  return (
    <section className='bg-gray-900 text-gray-300'>

      <section className="flex flex-row justify-between items-center p-5 text-xl border-b font-medium">
        <p>Filtreaza dupa Judet:</p>
        <select name="citySelector" id="citySelector" onChange={handleChange} className='text-gray-900' value={filter}>
          <option value="">--Alege un Judet--</option>
          {counties.map(county => 
            <option 
              key={county.id} 
              value={county.id}
            >
              {county.name}
            </option>
          )}
        </select>
      </section>

      <ErrorMsg color={msgColor}>{serverMsg ? serverMsg : 'Adauga un oras'}</ErrorMsg>

      <CityForm 
        counties={counties}
        buttonText='Adauga'
        handleSubmit={handleCreate}
      />

      {cities.map(city => 
        <City 
          key={city.id} 
          toggleConfDelBox={() => toggleConfDelBox(city.id)}
          handleEdit={() => handleEdit(city.id)} 
          city={city} 
          handleDelete={() => handleDelete(city.id)}
          handleUpdate={handleUpdate}
          counties={counties}
          className={filter && city.CountyId !== filter && "hidden"}
        />
      )}

    </section>
  )
}


const CityForm = ({handleSubmit, buttonText, city, counties}) => {
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
    <form onSubmit={formik.handleSubmit} className='h-60'>
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
          className='text-gray-900 w-full font-bold bg-gray-300'
        >
          <option value=''>Selecteaza un judet</option>
          {counties.map(county => <option key={county.id} value={county.id} className='font-normal bg-gray-300 '>{county.name}</option>)}
        </select>
      </section>
    
      <section className="mb-2">
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
    
      <button type="submit">{buttonText}</button>
    </form>
  )
}



const City = ({city, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, counties, className}) => {
  
  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/Locations', {state: {...city}})
  }

  return (
    <>{!city.edit 
      ?<section className={`flex flex-row justify-between p-5 items-center border-b border-gray-300 ${className}`}>
        {city.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick} className="text-2xl break-all">{city.name} ({city?.Locations?.length || 0})</h3>
          <div className="flex flex-row">
              <button type="button" onClick={handleEdit} className='mx-1'>Edit</button>
              <button type="button" onClick={toggleConfDelBox} className='mx-1'>Delete</button>
          </div>
      </section>

      :<CityForm 
      city={city}
      counties={counties}
      buttonText='Salvati'
      handleSubmit={handleUpdate}
      />}
    </>
  )
}


export default Cities