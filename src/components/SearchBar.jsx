import { useEffect, useState } from 'react'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SearchBar = ({list, setFilterList, compare}) => {

    const [filter, setFilter] = useState('')

    useEffect(() => {
        const newUsers = list?.filter(item => item?.[compare]?.toLowerCase().includes(filter.toLowerCase()))
        setFilterList(newUsers)
    }, [filter, list])

  return (
    <section className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] lg:justify-start p-5 text-white flex flex-row justify-between items-center gap-5 text-2xl bg-gray-900">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input 
            id="filterBar"
            name="filterBar"
            placeholder="Nume utilizator"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            />
        </section>
  )
}

export default SearchBar