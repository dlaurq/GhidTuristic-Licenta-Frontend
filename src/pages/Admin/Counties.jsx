import React, { useEffect, useState } from 'react'
import api from "../../api/axios"
import ErrorMsg from '../../components/ErrorMsg'
import { useLocation } from 'react-router-dom'
import { useFormik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import ConfBox from '../../components/ConfBox'

const Counties = () => {
  const [countries ,setCountries] = useState([])
  const [counties ,setCounties] = useState([])
  const [filter, setFilter] = useState('')
  const [serverMsg, setServerMsg] = useState()
  const [msgColor, setMsgColor] = useState('')

  const location = useLocation()

  useEffect(() =>{
    fetchCountries()
    fetchCounties()
    setFilter(location?.state?.id)
    console.log(location)
  },[])

  const fetchCountries = async () =>{
    try{
      const res = await api.get('api/countries')
      setCountries(res.data)
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
      const res = await api.post('api/counties',{name:values.county, countryId:values.country})
      const newCounties = [...counties, {...res.data.county}]
      setCounties(newCounties)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.message}`)
      setMsgColor('text-red-500')
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`api/counties/${id}`)
      const newCounties = counties.filter(county => county.id !== id)
      setCounties(newCounties)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`api/counties/${values.id}`,{name:values.county,countryId:values.country})
      const newCounties = counties.map(county => (county.id === values.id ? {...county, name:values.county, edit:false} : {...county}))
      setCounties(newCounties)
      setServerMsg(res.data.message)
      setMsgColor('text-blue-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
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

  return (
    <section className='bg-gray-900 text-gray-300'>

      <section className="flex flex-row justify-between items-center p-5 text-xl border-b font-medium">
        <p>Filtreaza dupa tara:</p>
        <select name="countrySelector" id="countrySelector" onChange={handleChange} className='text-gray-900' value={filter}>
          <option value="">--Alege o tara--</option>
          {countries.map(country => 
            <option 
              key={country.id} 
              value={country.id}
            >
              {country.name}
            </option>
          )}
        </select>
      </section>

      <ErrorMsg color={msgColor}>{serverMsg ? serverMsg : "Adauga un judet"}</ErrorMsg>

      <CountyForm 
        countries={countries}
        buttonText='Adauga'
        handleSubmit={handleCreate}
      />

      {counties.map(county => 
        <County 
          key={county.id} 
          toggleConfDelBox={() => toggleConfDelBox(county.id)}
          handleEdit={() => handleEdit(county.id)} 
          county={county} 
          handleDelete={() => handleDelete(county.id)}
          handleUpdate={handleUpdate}
          countries={countries}
          className={filter && county.CountryId !== filter && "hidden"}
        />
      )}

    </section>
  )
}


const County = ({county, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, countries, className}) => {
  
  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/City', {state: {...county}})
  }


  return (
    <>{!county.edit 
      ?<section className={`flex flex-row justify-between p-5 items-center border-b border-gray-300 ${className}`}>
        {county.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick} className="text-2xl break-all">{county.name} ({county?.Cities?.length || 0})</h3>
          <div className="flex flex-row">
              <button type="button" onClick={handleEdit} className='mx-1'>Edit</button>
              <button type="button" onClick={toggleConfDelBox} className='mx-1'>Delete</button>
          </div>
      </section>

      :<CountyForm 
      county={county}
      countries={countries}
      buttonText='Salvati'
      handleSubmit={handleUpdate}
      />}
    </>
  )
}



const CountyForm = ({handleSubmit, buttonText, county, country, countries}) => {
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
    <form onSubmit={formik.handleSubmit} className='h-60'>
      <section>
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
          className='text-gray-900 w-full font-bold bg-gray-300'
        >
          <option value=''>Selecteaza o tara</option>
          {countries.map(country => <option key={country.id} value={country.id} className='font-normal bg-gray-300 '>{country.name}</option>)}
        </select>
      </section>
    
      <section className="mb-2">
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
    
      <button type="submit">{buttonText}</button>
    </form>
  )
}



export default Counties