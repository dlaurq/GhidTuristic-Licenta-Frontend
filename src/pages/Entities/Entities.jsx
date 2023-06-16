import React, { useEffect, useState } from 'react'
import EntityCard from '../../components/EntityCard'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import SearchBar from '../../components/SearchBar'
import ReactMapGl, {Marker, Popup, Source, Layer} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css' 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index"
import { faHotel, faBed } from "@fortawesome/free-solid-svg-icons/index"
import { faUtensils } from "@fortawesome/free-solid-svg-icons/index"
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/index'

const Entities = () => {

    const [showFilters, setShowFilters] = useState()
    const [geo, setGeo] = useState({})
    const [filters, setFilters] = useState({sort: false, country:'', county: '', city: '', category: ''})
    const [entities, setEntities] = useState([])
    const [categories, setCategories] = useState([])
    const [filteredEntities, setFilteredEntities] = useState(entities)
    const [entitiInfo, setEntitiInfo] = useState(null)
    const [filter, setFilter] = useState('')
    const [viewport, setViewport] = useState({
      latitude: 45.9432,
      longitude: 24.9668,
      zoom: 6,
    })

    const api = useAxiosPrivate()

    useEffect(() => {
        const fetchPlaces = async () => {
            const res = await api.get('/places')
            setEntities(res.data)
            setFilteredEntities(res.data)
            console.log(res.data)
        }

        const fetchGeo = async () => {
            const res = await api.get('/geo')
            setGeo(res.data)
        }

        const fetchCategories = async () => {
            const res = await api.get('/categories')
            console.log(res.data)
            setCategories(res.data)
        }

        fetchPlaces()
        fetchGeo()
        fetchCategories()
    }, [])

    useEffect(() => {
        //sortEntities()
        handleFilter()
    }, [filters, filter])

    const toggleShowFilters = () => {
        setShowFilters( prevShowFilters => ! prevShowFilters)
    }

    const sortEntities = () => {
        const newArr = entities.sort(compareFN)
        setEntities([...newArr])
    }


    const compareFN = (a, b) => {
        let rev1, rev2
        if(a.Reviews.length === 0) rev1 = 0
        if(a.Reviews.length === 1) rev1 = a.Reviews[0].rating

        if(b.Reviews.length === 0) rev2 = 0
        if(b.Reviews.length === 1) rev2 = b.Reviews[0].rating

        if(a.Reviews.length > 1) rev1 = a.Reviews?.reduce((r1, r2) => r1.rating + r2.rating, 0)
        if(b.Reviews.length > 1) rev2 = b.Reviews?.reduce((r1, r2) => r1.rating + r2.rating, 0)

        if(!filters.sort) return rev1 - rev2

        return rev2 - rev1
    }


    const handleFilter = () => {
        let newArr = entities.filter(entity => filters.category.length === 0 || entity.Category.id === filters.category)
        newArr = newArr.filter(entity => filters.city.length === 0 ||  entity.Location.City.id === filters.city)
        newArr = newArr.filter(entity => filters.county.length === 0 ||  entity.Location.City.County.id === filters.county)
        newArr = newArr.filter(entity => filters.country.length === 0 ||  entity.Location.City.County.Country.id === filters.country)
        newArr = newArr.sort(compareFN)
        newArr = newArr?.filter(entity => entity?.name?.toLowerCase().includes(filter.toLowerCase()))
        setFilteredEntities(newArr)
    } 


  return (
    <section className=''>
            <hr className='sm:hidden' />
            <section className='p-5 text-xl bg-gray-900 sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] sm:mt-5 flex flex-row gap-5 justify-start items-center'>
                <label htmlFor="sort">
                    Sorteaza dupa: 
                </label>
                <select 
                    name="sort"
                    id="sort"
                    onChange={() =>setFilters({...filters, sort: !filters.sort})}
                >
                    <option value='rating'>Rating (Mic-Mare)</option>
                    <option value='rating'>Rating (Mare-Mic)</option>
                    {/** 
                    <option value='PriceLH'>Pret (Mic-Mare)</option>
                    <option value='PriceHL'>Pret (Mare-Mic)</option>
                    */}
                </select>
            </section>
 

            <hr />

            <button 
                type="button"
                className='text-left p-5 bg-gray-900 border-0 w-full  border-b-2 sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem]'
                onClick={toggleShowFilters}
            >Filtre</button>


            {showFilters
                &&<section className='w-full flex flex-col justify-start p-5 gap-5 bg-gray-900 sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem]'>

                    <section>
                        <label htmlFor="categories">
                            Categorie:
                        </label>
                        <select 
                            name="categorie"
                            id="categorie"
                            onChange={(e) =>setFilters({...filters, category: e.target.value})}
                            className=''
                        >
                            <option value=''>Selecteaza o categorie</option>
                            {categories?.map( category => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                        
                    </section>

                    <section className='  '>
                        <label htmlFor="country">
                            Tara: 
                        </label>
                        <select 
                            name="country"
                            id="country"
                            onChange={(e) =>setFilters({...filters,city: '', county: '', country: e.target.value})}
                            className=''
                        >
                            <option value=''>Selecteaza o tara</option>
                            {geo?.countries?.map( country => <option key={country.id} value={country.id}>{country.name}</option>)}
                        </select>
                    </section>
                    <section className=''>
                        <label htmlFor="county">
                            Judet: 
                        </label>
                        <select 
                            name="county"
                            id="county"
                            onChange={(e) =>setFilters({...filters,city: '', county: e.target.value})}
                            className=''
                        >
                            <option value=''>Selecteaza un judet</option>
                            {geo?.counties?.filter( county => county.CountryId === filters.country).map( county => <option key={county.id} value={county.id}>{county.name}</option>)}
                        </select>
                    </section>
                    <section className=''>
                        <label htmlFor="city">
                            Oras: 
                        </label>
                        <select 
                            name="city"
                            id="city"
                            onChange={(e) =>setFilters({...filters, city: e.target.value})}
                            value={filters.city}
                        >
                            <option value=''>Selecteaza un oras</option>
                            {geo?.cities?.filter( city => city.CountyId === filters.county).map( city => <option key={city.id} value={city.id}>{city.name}</option>)}
                        </select>
                    </section>
                </section>
            }
        <hr />

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

        <div className='p-3'></div>

        <section className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem]">
            <ReactMapGl 
            {...viewport}
            onMove={evt => setViewport(evt.viewport)}
            style={{width: '100%', height: '80vh'}}
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            mapStyle='mapbox://styles/dlaurq/clivjzr5p012g01pfh1e0ggud' 
            asyncRender={true}
            
            >
                {filteredEntities.map(entity =>entity.lat && entity.lng &&
                    <Marker 
                    key={entity.id}
                    latitude={entity.lat}
                    longitude={entity.lng}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setEntitiInfo(entity);
                    }}
                    >
                        
                    </Marker>
                )}

                    {/**Border RO */}
                <Source id='RO_BORDERS' type="geojson" data='/gadm41_ROU_1.json'>
                    <Layer id='RO_BORDERS-fill' type='line' source='RO_BORDERS' paint= {{'line-color': 'white', 'line-opacity': 0.8}} />
                </Source>

            </ReactMapGl>
        </section>

        {entities.length === 0 && <h3 className=''>Nu exista obiective</h3>}
            
            <section className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] md:grid md:grid-cols-2 md:auto-rows-fr md:gap-5 lg:grid-cols-3 md:auto-rows-auto">
                {filteredEntities.map(entity => 
                    <EntityCard 
                        key={entity.id} 
                        entity={entity} 
                        className={`
                            
                        `} 
                    />
                )}
            </section>
           
        
    </section>
  )
}

export default Entities