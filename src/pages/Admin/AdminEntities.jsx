import { useState } from "react"
import { useEffect } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useLocation } from "react-router-dom"
import EntityCard from "../../components/EntityCard"
import ConfBox from "../../components/ConfBox"
import SearchBar from "../../components/SearchBar"
import Filtru from "../../components/Filtru"
import ErrorMsg from "../../components/ErrorMsg"

const AdminEntities = () => {

  const [entities, setEntities] = useState([])
  const [filterEntities, setFilterEntities] = useState(entities)
  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState('')
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})

  const location = useLocation()
  const api = useAxiosPrivate()

  useEffect(() => {
    setFilter(location?.state?.filter || '')

    const fetchEntities = async () => {
      try {
          const res = await api.get('/places')
          setEntities(res.data)
          console.log(res.data)
          setFilterEntities(res.data)
      } catch (err) {
          console.log(err)
      }
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
  }, [])

  const handleDeleteEntity = async (id) => {
    try {
        const res = await api.delete(`/places/${id}`)
        const newEntities = entities.filter(review => review.id !== id)
        setEntities(newEntities)
        setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    } catch (err) {
        console.log(err)
        setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
  }

  const toggleConfDelBox = (id)=>{
    const newEntities = entities.map(entity => entity.id === id ? {...entity, deleteBox:!entity.deleteBox} : entity)
    setEntities(newEntities)
  }
  

  return (
    <section>

      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

      <Filtru 
        text='Filtreaza dupa categorie:'
        handleChange={(e) => setFilter(e.target.value)}
        list={categories}
        placeholder='--Alege o categorie--'
        value={filter}
      />

      <hr />

      <SearchBar list={entities} setFilterList={setFilterEntities} compare='name' />

      

      <section className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] md:grid md:grid-cols-2 md:auto-rows-fr md:gap-5 lg:grid-cols-3">
        {filterEntities?.map(entity => 
          <EntityCard key={entity.id} entity={entity} className={filter && entity.CategoryId !== filter && "hidden"} >
            <section className="mt-5">
                <button type="button" onClick={() => toggleConfDelBox(entity.id)} className="sm:px-5 sm:w-auto  bg-red-500 text-left pl-5 w-full border-2 font-bold">Sterge Entitatea</button>
                {entity.deleteBox && <ConfBox handleNo={() => toggleConfDelBox(entity.id)} handleYes={() => handleDeleteEntity(entity.id)} >Confirmati stergerea?</ConfBox>}
            </section>
          </EntityCard>
        )}
      </section>
      

    </section>
  )
}

export default AdminEntities