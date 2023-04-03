import { useState } from "react"
import Input from "../../../components/Input"
import { faCaretDown, faCaretUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from "react"
import Button from "../../../components/Button"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { useLocation } from "react-router-dom"
import EntityCard from "../../../components/EntityCard"
import ConfBox from "../../../components/ConfBox"

const AdminEntities = () => {

  const [entities, setEntities] = useState([])
  const [filter, setFilter] = useState('')
  const [filterEntities, setFilterEntities] = useState(entities)
  const [showConfBox, setShowConfBox] = useState(false)

  const location = useLocation()
  const api = useAxiosPrivate()

  const toggleShowConfBox = () => setShowConfBox(prev => !prev)

  useEffect(() => {
    setFilter(location?.state?.search || '')

    const fetchEntities = async () => {
      try {
          const res = await api.get('/places')
          setEntities(res.data)
          setFilterEntities(res.data)
      } catch (err) {
          console.log(err)
      }
    }
    fetchEntities()
  }, [])

  useEffect(() => {
    const newEntities = entities.filter(entity => entity.name.includes(filter) )
    setFilterEntities(newEntities)
}, [filter, entities])

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

      <section className="p-5 bg-gray-900 text-gray-300 flex flex-row justify-between items-center gap-5">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <Input 
        id="filterBar"
        name="filterBar"
        placeholder="Nume utilizator"
        value={filter}
        handleChange={(e) => setFilter(e.target.value)}
        />
      </section>

      <hr />

      {filterEntities?.map((entity, index) => 
        <EntityCard key={index} name={entity.name} >
          <section className="mt-5">
              <Button handleClick={toggleShowConfBox} className="w-full text-gray-300 border-gray-300 border-2 font-bold">Sterge Entitatea</Button>
              {showConfBox && <ConfBox handleNo={toggleShowConfBox} handleYes={() => handleDeleteEntity(entity.id)} >Confirmati stergerea?</ConfBox>}
          </section>
        </EntityCard>
      )}

    </section>
  )
}

export default AdminEntities