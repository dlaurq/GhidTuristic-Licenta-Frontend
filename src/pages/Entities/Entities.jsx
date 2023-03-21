import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import EntityCard from '../../components/EntityCard'
import Label from '../../components/Label'
import Option from '../../components/Option'
import Select from '../../components/Select'
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
                <Label htmlFor="sort">
                    Sorteaza dupa: 
                </Label>
                <Select 
                    name="sort"
                    id="sort"
                    handleChange={handleFilterChange}
                    className=''
                >
                    <Option value='rating'>Rating</Option>
                    <Option value='PriceLH'>Pret (Mic-Mare)</Option>
                    <Option value='PriceHL'>Pret (Mare-Mic)</Option>
                </Select>
            </section>
            <Button 
                className='text-gray-300 bg-gray-900 border-0 w-full p-1 border-b-2'
                handleClick={toggleShowFilters}
            >Filtre</Button>
            {showFilters
                ?<section className='w-full text-center bg-gray-400'>
                    <section className='m-2 '>
                        <Label htmlFor="country">
                            Tara: 
                        </Label>
                        <Select 
                            name="country"
                            id="country"
                            handleChange={handleFilterChange}
                            className='bg-gray-400'
                        >
                            <Option value=''>Selecteaza o tara</Option>
                            {world.countries.map(country => <Option key={country.id} value={country.id}>{country.name}</Option>)}
                        </Select>
                    </section>
                    <section className='m-2'>
                        <Label htmlFor="county">
                            Judet: 
                        </Label>
                        <Select 
                            name="county"
                            id="county"
                            handleChange={handleFilterChange}
                            className='bg-gray-400'
                        >
                            <Option value=''>Selecteaza un judet</Option>
                            {world.counties.map(county => <Option key={county.id} value={county.id}>{county.name}</Option>)}
                        </Select>
                    </section>
                    <section className='m-2 '>
                        <Label htmlFor="city">
                            Oras: 
                        </Label>
                        <Select 
                            name="city"
                            id="city"
                            handleChange={handleFilterChange}
                            className='bg-gray-400'
                        >
                            <Option value='rating'>Selecteaza un oras</Option>
                            {world.cities.map(city => <Option key={city.id} value={city.id}>{city.name}</Option>)}
                        </Select>
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