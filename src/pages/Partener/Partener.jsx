import React, { useEffect, useState } from 'react'
import NewEntityForm from './components/NewEntityForm'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import jwt_decode from "jwt-decode"
import useAuth from '../../hooks/useAuth'
import EntityCard from '../../components/EntityCard'
import ConfBox from '../../components/ConfBox'
import ErrorMsg from '../../components/ErrorMsg'
import DropDownForm from '../../components/DropDownForm'
import Filtru from '../../components/Filtru'
import SearchBar from '../../components/SearchBar'

const Partener = () => {

  const [toggleForm, setToggleForm] = useState(false)
  const [entities, setEntities] = useState([])
  const [showConfBox, setShowConfBox] = useState(false)
  const [showEditBox, setShowEditBox] = useState(false)
  const [formSubmited, setFormSubmited] = useState(false)
  const [filter, setFilter] = useState('')
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})
  const [filterEntities, setFilterEntities] = useState(entities)
  const [categories, setCategories] = useState([])

  const { auth } = useAuth()

  const api = useAxiosPrivate()

  //const toggleShowConfBox = () => setShowConfBox(prev => !prev)

  useEffect(() => {

    const fetchEntities = async () => {
      const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

      const username = decoded.UserInfo.username

      const res = await api.get(`/places/user/${username}`)
      //console.log(res.data)
      setEntities(res.data)
      setFilterEntities(res.data)
    }

    const fetchCategories = async () => {
      try{
        const res = await api.get('/categories')
        setCategories(res.data)
      } catch(err){
        console.log(err)
      }
    }

    fetchCategories()

    fetchEntities()
  }, [formSubmited])



  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/places/${id}`)
      const newEntities = entities.filter(review => review.id !== id)
      setEntities(newEntities)
      //console.log(id)      
      //console.log(res)      
    } catch (err) {
      console.log(err)
    }
    
  }

  return (
    <section className=''>

      <hr />
      
      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

      <DropDownForm 
        text='Adauga o entitate' 
        form={<NewEntityForm setFormSubmited={setFormSubmited} setEntities={setEntities} setToggleForm={setToggleForm} setServerResp={setServerResp}/>}
      />

      <hr />

      <Filtru 
        text='Filtreaza dupa tara:'
        handleChange={(e) => setFilter(e.target.value)}
        list={categories}
        placeholder='--Alege un tara--'
        value={filter}
      />

      <hr />

      <SearchBar list={entities} setFilterList={setFilterEntities} compare='name' />

      <div className="p-2"></div>

      <hr />
      
      <section className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] md:grid md:grid-cols-2 md:auto-rows-fr md:gap-5 lg:grid-cols-3 md:auto-rows-auto">
        {filterEntities.length === 0  && <h3 className=''>Nu aveti nici o entitate inregistrata</h3>}

        {filterEntities.map(entity => entity.id !== showEditBox 
          ? <EntityCard key={entity.id} entity={entity} className={filter && entity.Category.id !== filter && "!hidden"}>
              <section className='flex flex-col justify-between gap-4 mt-5 md:pr-5'>
                <button className='text-gray-900 border-gray-900 font-bold border-4' type='button' onClick={() => setShowEditBox(entity.id)}>Editeaza</button>
                <button className='text-red-500 font-bold border-4 border-red-500' type='button' onClick={() => setShowConfBox(entity)}>Sterge</button>
                {showConfBox?.id === entity.id && <ConfBox handleNo={() => setShowConfBox({})} handleYes={() => handleDelete(entity.id)} >Confirmati stergerea?</ConfBox>}
              </section>
          </EntityCard>
          :<NewEntityForm 
            setFormSubmited={setFormSubmited} 
            setEntities={setEntities} 
            key={entity.id} 
            entity={entity} 
            submitTxt="Salveaza" 
            update={true} 
            hideForm={() => setShowEditBox(false)}
            className='md:mt-5 col-span-3'
            >
            <section>
              <button type='button' className="w-full md:w-80" onClick={() => setShowEditBox(false)}>
                Cancel
              </button>
            </section>
          </NewEntityForm>
          
        )}
      </section>

    </section>
  )
}

export default Partener