import React, { useEffect, useState } from 'react'
import EntityCard from '../../components/EntityCard'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Entities = () => {

    const [showFilters, setShowFilters] = useState()
    const [world, setWorld] = useState({})
    const [filters, setFilters] = useState({sort: 'rating', country:'', county: '', city: ''})
    const [entities, setEntities] = useState([])

    const api = useAxiosPrivate()

    useEffect(() => {
        const fetchPlaces = async () => {
            const res = await api.get('/places')
            setEntities(res.data)
        }

        const fetchWorld = async () => {
            const res = await api.get('/geo')
            setWorld(res.data)
        }

        fetchPlaces()
        fetchWorld()
    }, [])

    useEffect(() => {
        const filter = () => {

        }

        filter()
    }, [filters])

    const handleFilterChange = (e) => {
        console.log(e.target.name)
        setFilters(prevFilters => {return {...prevFilters, [e.target.name]: e.target.value}})
        console.log(filters)
    }

    const toggleShowFilters = () => {
        setShowFilters( prevShowFilters => ! prevShowFilters)
    }


  return (
    <section className=' mx-auto bg-gray-900'>
        <nav className='flex flex-col justify-between items-center w-full text-gray-900 font-medium bg-white'>
            <section className='m-2'>
                <label htmlFor="sort">
                    Sorteaza dupa: 
                </label>
                <select 
                    name="sort"
                    id="sort"
                    onChange={handleFilterChange}
                >
                    <option value='rating'>Rating</option>
                    <option value='PriceLH'>Pret (Mic-Mare)</option>
                    <option value='PriceHL'>Pret (Mare-Mic)</option>
                </select>
            </section>
            <button 
                type="button"
                className='text-gray-300 bg-gray-900 border-0 w-full p-1 border-b-2'
                onClick={toggleShowFilters}
            >Filtre</button>
            {showFilters
                ?<section className='w-full text-center bg-gray-400'>
                    <section className='m-2 '>
                        <label htmlFor="country">
                            Tara: 
                        </label>
                        <select 
                            name="country"
                            id="country"
                            onChange={handleFilterChange}
                            className='bg-gray-400'
                        >
                            <option value=''>Selecteaza o tara</option>
                            {world.countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
                        </select>
                    </section>
                    <section className='m-2'>
                        <label htmlFor="county">
                            Judet: 
                        </label>
                        <select 
                            name="county"
                            id="county"
                            onChange={handleFilterChange}
                            className='bg-gray-400'
                        >
                            <option value=''>Selecteaza un judet</option>
                            {world.counties.map(county => <option key={county.id} value={county.id}>{county.name}</option>)}
                        </select>
                    </section>
                    <section className='m-2 '>
                        <label htmlFor="city">
                            Oras: 
                        </label>
                        <select 
                            name="city"
                            id="city"
                            handleChange={handleFilterChange}
                            onChange='bg-gray-400'
                        >
                            <option value='rating'>Selecteaza un oras</option>
                            {world.cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
                        </select>
                    </section>
                </section>
                : null
            }
        </nav>
        {entities.length === 0 
            ? <h3 className='text-gray-300'>Nu exista obiective</h3>
            : entities.map(entity => <EntityCard key={entity.id} entity={entity} />)
        }
    </section>
  )
}

export default Entities