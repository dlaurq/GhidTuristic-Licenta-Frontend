import React, { useEffect, useState } from 'react'
import api from "../../../api/axios"
import ErrorMsg from '../../../components/ErrorMsg'
import County from './components/County'
import CountyForm from './components/CountyForm'

const Counties = () => {
  const [countries ,setCountries] = useState([])
  const [counties ,setCounties] = useState([])
  const [filter, setFilter] = useState('')
  const [serverMsg, setServerMsg] = useState()
  const [msgColor, setMsgColor] = useState('')

  useEffect(() =>{
    fetchCountries()
    fetchCounties()
  },[])

  useEffect(() =>{
    if(filter !== ''){
      getCountiesByCountry(filter)
    }
  },[filter])

  const fetchCountries = async () =>{
    try{
      const res = await api.get('/countries')
      setCountries(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const fetchCounties = async () =>{
    try{
      const res = await api.get('/counties')
      setCounties(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const getCountiesByCountry = async (id) =>{
    try{
      const res = await api.get(`/counties/country/${id}`)
      setCounties(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const handleChange = (e) =>{
    if(e.target.value !== ''){
      setFilter(e.target.value)
    }
  }

  const handleCreate = async (values) =>{
    try{
      const res = await api.post('/counties',{name:values.county, countryId:values.country})
      console.log(res.data)
      const newCountries = [...countries, {...res.data.country, edit:false}]
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`/counties/${id}`)
      const newCountries = countries.filter(country => country.id !== id)
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-red-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
    }

  }
  
  const handleUpdate = async (values) =>{
    console.log(values)
    try{
      const res = await api.patch(`/counties/${values.id}`,{name:values.country})
      const newCountries = countries.map(country => (country.id === values.id ? {...country, name:values.country, edit:false} : {...country}))
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-blue-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
    }
  }

  const handleEdit = async (id) => {
    const newCountries = countries.map(country => (country.id === id ? {...country, edit:true} : {...country, edit:false}))
    setCountries(newCountries)
    
  }

  return (
    <section className='bg-gray-900 text-gray-300'>

      <section className="flex flex-row justify-between items-center p-5 text-xl border-b font-medium">
        <p>Filtreaza dupa tara:</p>
        <select name="countrySelector" id="countrySelector" onChange={handleChange} className='text-gray-900'>
          <option value="">--Alege o tara--</option>
          {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
        </select>
      </section>

      <ErrorMsg color={msgColor}>{serverMsg}</ErrorMsg>

      <CountyForm 
        countries={countries}
        buttonText='Adauga'
        handleSubmit={handleCreate}
      />

      {counties.map(county => <County key={county.id} county={county} handleDelete={handleDelete}/>)}

    </section>
  )
}

export default Counties