import { useState } from "react"
import { faCaretDown, faCaretUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useLocation } from "react-router-dom"
import EntityCard from "../../components/EntityCard"
import ConfBox from "../../components/ConfBox"

const AdminEntities = () => {

  const [entities, setEntities] = useState([])
  const [search, setSearch] = useState('')
  const [filterEntities, setFilterEntities] = useState(entities)
  const [showConfBox, setShowConfBox] = useState(false)
  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState('')

  const location = useLocation()
  const api = useAxiosPrivate()

  const toggleShowConfBox = () => setShowConfBox(prev => !prev)

  useEffect(() => {
    setSearch(location?.state?.search || '')
    setFilter(location?.state?.filter || '')

    const fetchEntities = async () => {
      try {
          const res = await api.get('/places')
          //console.log(res.data)
          setEntities(res.data)
          setFilterEntities(res.data)
      } catch (err) {
          console.log(err)
      }
    }

    const fetchCategories = async () => {
      try{
        const res = await api.get('/categories')
        //console.log(res.data)
        setCategories(res.data)
      } catch(err){
        console.log(err)
      }
    }


    fetchCategories()
    fetchEntities()
  }, [])

  useEffect(() => {
    const newEntities = entities.filter(entity => entity.name.toLowerCase().includes(search.toLowerCase()) && entity?.Category?.id === filter || filter === '')
    setFilterEntities(newEntities)
}, [search, filter, entities])



  const handleDeleteEntity = async (id) => {
    try {
        const res = await api.delete(`/places/${id}`)
        const newEntities = entities.filter(review => review.id !== id)
        setEntities(newEntities)
    } catch (err) {
        console.log(err)
    }
  }

  return (
    <section>

    <section className="p-5 bg-gray-900 text-gray-300 text-xl">
      <p className="mb-2">Filtreaza dupa categorie: </p>
      <select 
        name='categories'
        id='categories'
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
        
        >
        <option value=''>
          Alege o categorie
        </option>
        {categories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
    </section>


      <section className="p-5 bg-gray-900 text-gray-300 flex flex-row justify-between items-center gap-5">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <input 
        id="searchBar"
        name="searchBar"
        placeholder="Nume utilizator"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <hr />

      {filterEntities?.map((entity, index) => 
        <EntityCard key={entity.id} name={entity.name} >
          <section className="mt-5">
              <button type="button" onClick={toggleShowConfBox} className="w-full text-gray-300 border-gray-300 border-2 font-bold">Sterge Entitatea</button>
              {showConfBox && <ConfBox handleNo={toggleShowConfBox} handleYes={() => handleDeleteEntity(entity.id)} >Confirmati stergerea?</ConfBox>}
          </section>
        </EntityCard>
      )}

    </section>
  )
}

export default AdminEntities