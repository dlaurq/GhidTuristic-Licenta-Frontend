import React, { useEffect, useState } from 'react'
import api from "../../../api/axios"
import ErrorMsg from '../../../components/ErrorMsg'
import County from './components/County'
import CountyForm from './components/CountyForm'
import Select from '../../../components/Select'
import Option from '../../../components/Option'

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

  const handleChange = (e) =>{
    setFilter(e.target.value)
    
  }

  const handleCreate = async (values) =>{
    try{
      const res = await api.post('/counties',{name:values.county, countryId:values.country})
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
      const res = await api.delete(`/counties/${id}`)
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
      const res = await api.patch(`/counties/${values.id}`,{name:values.county,countryId:values.country})
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
        <Select name="countrySelector" id="countrySelector" handleChange={handleChange} className='text-gray-900'>
          <Option value="">--Alege o tara--</Option>
          {countries.map(country => 
            <Option 
              key={country.id} 
              value={country.id}
            >
              {country.name}
            </Option>
          )}
        </Select>
      </section>

      <ErrorMsg color={msgColor}>{serverMsg}</ErrorMsg>

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
          classes={filter && county.CountryId !== filter && "hidden"}
        />
      )}

    </section>
  )
}

export default Counties