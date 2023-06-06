import React, { useEffect, useState } from 'react'
import api from "../../api/axios"
import ErrorMsg from '../../components/ErrorMsg'
import { useLocation } from 'react-router-dom'
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import ConfBox from '../../components/ConfBox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import DropDownForm from "../../components/DropDownForm"
import Filtru from '../../components/FIltru'

const Cities = () => {
  const [cities ,setCities] = useState([])
  const [counties ,setCounties] = useState([])
  const [filter, setFilter] = useState('')

  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})

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
    }catch (err){
      console.log(err)
    }
  }

  const fetchCounties = async () =>{
    try{
      const res = await api.get('api/counties')
      setCounties(res.data)
      setServerMsg('')
    }catch (err){
      console.log(err)
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
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`api/cities/${id}`)
      const newCities = cities.filter(city => city.id !== id)
      setCities(newCities)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`api/cities/${values.id}`,{name:values.city,countyId:values.county})
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
    <section className=''>

      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

      <Filtru 
        text='Filtreaza dupa Judet:'
        handleChange={handleChange}
        list={counties}
        placeholder='--Alege un Judet--'
        value={filter}
      />

      <DropDownForm 
        text='Adauga un oras' 
        form={<CityForm counties={counties} buttonText='Adauga' handleSubmit={handleCreate} />}
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
          hideForm={hideForm}
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



const City = ({city, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, counties, className, hideForm}) => {
  
  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/Locations', {state: {...city}})
  }

  return (
    <>{!city.edit 
      ?<section className={`last:border-0 sm:mx-16 md:mx-28 lg:mx-36 flex flex-row justify-between p-5 items-center text-gray-900 bg-white border-gray-900 border-b-2 ${className}`}>
        {city.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick} className="text-2xl break-all">{city.name} ({city?.Locations?.length || 0})</h3>
          <section className=" text-3xl flex flex-row justify-between items-center gap-5">
              <FontAwesomeIcon icon={faPenToSquare} className='cursor-pointer pl-5' onClick={handleEdit}/>
              <FontAwesomeIcon icon={faX} className='cursor-pointer' onClick={toggleConfDelBox}/>
            </section>
      </section>

      :<CityForm 
      city={city}
      counties={counties}
      buttonText='Salvati'
      handleSubmit={handleUpdate}
      >
        <button className="sm:w-40 mt-5 md:w-60 lg:w-80" type="button" onClick={hideForm}>Cancel</button>
      </CityForm>
      }
    </>
  )
}


export default Cities