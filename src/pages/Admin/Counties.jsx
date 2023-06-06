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

const Counties = () => {
  const [countries ,setCountries] = useState([])
  const [counties ,setCounties] = useState([])
  const [filter, setFilter] = useState('')
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})

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
    }catch (err){
    }
  }

  const fetchCounties = async () =>{
    try{
      const res = await api.get('api/counties')
      setCounties(res.data)
    }catch (err){
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
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`api/counties/${id}`)
      const newCounties = counties.filter(county => county.id !== id)
      setCounties(newCounties)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`api/counties/${values.id}`,{name:values.county,countryId:values.country})
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
    <section className=''>

      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

      <DropDownForm 
        text='Adauga un judet' 
        form={<CountyForm countries={countries} buttonText='Adauga' handleSubmit={handleCreate}/>}
      />



      {/** Filtare */}
      <section className="sm:mx-16 md:mx-28 lg:mx-36 px-5 py-3 text-white flex flex-col justify-between items-start text-2xl bg-gray-900">
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

     
      <section className='bg-white'>
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
            hideForm={hideForm}
          />
        )}
      </section>

      

    </section>
  )
}


const County = ({county, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, countries, className, hideForm}) => {
  
  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/City', {state: {...county}})
  }


  return (
    <>
      {!county.edit 
        ?<section className={`last:border-0 sm:mx-16 md:mx-28 lg:mx-36 flex flex-row justify-between p-5 items-center text-gray-900 bg-white border-gray-900 border-b-2 ${className}`}>
          {county.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
            <h3 onClick={handleClick} className="text-2xl break-all">{county.name} ({county?.Cities?.length || 0})</h3>
            <section className=" text-3xl flex flex-row justify-between items-center gap-5">
              <FontAwesomeIcon icon={faPenToSquare} className='cursor-pointer pl-5' onClick={handleEdit}/>
              <FontAwesomeIcon icon={faX} className='cursor-pointer' onClick={toggleConfDelBox}/>
            </section>
        </section>

        :<CountyForm 
          county={county}
          countries={countries}
          buttonText='Salvati'
          handleSubmit={handleUpdate}
        >
          <button className="sm:w-40 mt-5 md:w-60 lg:w-80" type="button" onClick={hideForm}>Cancel</button>
        </CountyForm>
      }
    </>
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