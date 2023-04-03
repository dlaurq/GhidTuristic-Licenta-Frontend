import { useState } from "react"
import Input from "../../../components/Input"
import { faCaretDown, faCaretUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from "react"
import Button from "../../../components/Button"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { useLocation } from "react-router-dom"

const AdminEntities = () => {

  const [entities, setEntities] = useState([])
  const [filter, setFilter] = useState('')
  const [filterEntities, setFilterEntities] = useState(entities)

  const location = useLocation()

  useEffect(() => {
    setFilter(location?.state?.search || '')
  }, [])

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

    </section>
  )
}

export default AdminEntities