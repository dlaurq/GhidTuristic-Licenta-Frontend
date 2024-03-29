import { useEffect } from "react"
import { useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import EntityCard from "../components/EntityCard"
import SearchBar from "../components/SearchBar"
import useAuth from "../hooks/useAuth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons/index"
import ErrorMsg from "../components/ErrorMsg"


const CreeazaPlan = () => {

    const {auth} = useAuth()
    const [entities, setEntities] = useState([])
    const [date, setDate] = useState()
    const [filters, setFilters] = useState({sort: false, country:'', county: '', city: '', category: ''})
    const [categories, setCategories] = useState([])
    const [geo, setGeo] = useState({})
    const [showFilters, setShowFilters] = useState()
    const [filteredEntities, setFilteredEntities] = useState(entities)
    const [errMsg, setErrMsg] = useState('')
    const [submitEntities, setSubmitEntities] = useState([])
    const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})


    const api = useAxiosPrivate()

    useEffect(() => {
        const fetchEntities = async () => {
            try{
                const res = await api.get('/places')
                const arr = res.data.map(item => ({...item, checked: false}))
                setEntities(arr)
                setFilteredEntities(arr)
            }catch(err){
                
            }
        }
        const fetchGeo = async () => {
            try {
                const res = await api.get('/geo')
                setGeo(res.data)
            } catch (err) {
                
            }
        }

        const fetchCategories = async () => {
            try{
                const res = await api.get('/categories')
                setCategories(res.data)
            }catch(err){

            }
        }

        fetchGeo()
        fetchCategories()
        fetchEntities()
    }, [])

    const toggleShowFilters = () => {
        setShowFilters( prevShowFilters => ! prevShowFilters)
    }

    const handleCheck = (checked, entity) => {
        const newEntities = entities.map(item => item.id === entity.id ? {...item, checked: checked} : {...item})
        let subEntities = [...submitEntities]

        if(checked)
            subEntities.push({...entity, checked: checked})
      
        if(!checked)
            subEntities = submitEntities.filter(e => e.id !== entity.id)
            
        setEntities(newEntities)
        setSubmitEntities(subEntities)
    }

    const handleCreate = async () => {

        if(!date){
            setErrMsg('Selectati o zi')
            return
        }
        if(!entities.some(entity => entity.checked)){
            setErrMsg('Trebuie sa adaugati minim o entitate')
            return
        }

        try{
            const res = await api.post('/toVisit', {places: submitEntities, data: date, username: auth.username})
            setErrMsg('')
            const newEntities = entities.map(item => ({...item, checked: false}))
            setEntities(newEntities)
            setDate('')
            setSubmitEntities([])
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
            
        }

        
    }

    const handleSort = (dir, i) => {
        const arr = [...submitEntities]
        if(dir === 'left'){
            if(i === 0){
                const moveEntity = arr.shift()
                arr.push(moveEntity)
                setSubmitEntities(arr)
                return
            }
            const a = arr[i]
            const b = arr[i-1]
            arr[i] = b
            arr[i-1] = a
            
        }
        if(dir === 'right'){
            if(i === submitEntities.length -1){
                const moveEntity = arr.pop()
                arr.unshift(moveEntity)
                setSubmitEntities(arr)
                return
            }
            const a = arr[i]
            const b = arr[i+1]
            arr[i] = b
            arr[i+1] = a
        }
        setSubmitEntities(arr)
    }

  return (<>
    {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

    <section className='sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] p-5 '>

        <h3 className='text-2xl'>Creaza plan</h3>

        <div className='p-5'></div>

        <section className='flex flex-col justify-start gap-5'>
            <label className='text-gray-900 text-xl' htmlFor="date">Selecteaza ziua</label>
            <input type="date" name="date" id="date" onChange={(e) => setDate(e.target.value)} value={date}/>
        </section>

        <div className='p-5'></div>

        <section>

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

            <SearchBar list={entities} setFilterList={setFilteredEntities} compare='name' />

            <p className='text-2xl mt-5'>Selecteaza obiectivele pe care vrei sa le vizitezi</p>


            <section className="grid grid-cols-3 gap-5">
                {filteredEntities?.map(entity =>                    
                    <EntityCard 
                        className={`
                            ${entity.checked && '!hidden'}
                            ${filters.category && entity.Category.id !== filters.category && "!hidden"}
                            ${filters.city && entity.Location.City.id !== filters.city && "!hidden"}
                            ${filters.county && entity.Location.City.County.id !== filters.county && "!hidden"}
                            ${filters.country && entity.Location.City.County.Country.id !== filters.country && "!hidden"}
                            `
                        } 
                        key={entity.id} 
                        entity={entity} 
                        children={
                            <section className="flex flex-row justify-start  gap-5 text-2xl">
                                <label className="text-gray-900" htmlFor={`check-${entity.id}`}> Adauga in lista</label>
                                <input className="block w-10" type="checkbox" name={`check-${entity.id}`}  id={`check-${entity.id}`} checked={entity.checked} onChange={(e) => handleCheck(e.target.checked, entity)} />
                            </section>
                        }
                    />

                )}
            </section>
        </section>

        <div className='p-5'></div>

        <section>
            <p className='text-xl'>Obiectivele selectate</p>
            <section className="grid grid-cols-3 gap-5">
                {submitEntities?.map((entity, index) =>                    
                    <EntityCard className={!entity.checked && '!hidden'} key={entity.id} entity={entity} children={
                        <section >
                            <section className="flex flex-row justify-start  gap-5 text-2xl">
                                <label className="text-gray-900" htmlFor={`check-${entity.id}`}> Sterge din lista</label>
                                <input className="block w-10" type="checkbox" name={`check-${entity.id}`}  id={`check-${entity.id}`} checked={entity.checked} onChange={(e) => handleCheck(e.target.checked, entity)} />
                            </section>
                            <section className="flex flex-row justify-start  gap-5 text-2xl">
                                <button onClick={() => handleSort('left', index)} > <FontAwesomeIcon icon={faArrowLeft} /> </button>
                                <button onClick={() => handleSort('right', index)} > <FontAwesomeIcon icon={faArrowRight} /> </button>
                            </section>

                        </section>
                    }/>

                )}
            </section>
        </section>

        <div className='p-5'></div>
        <p className="text-red-500 text-xl">{errMsg}</p>
        <button onClick={handleCreate}>Creeaza lista</button>
    </section>
    </>)
}

export default CreeazaPlan