import React, { useEffect, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Review from '../../components/Review'
import ReviewForm from './components/ReviewForm'
import useAuth from '../../hooks/useAuth'
const Entity = (props) => {

    const {name} = useParams()
    const api = useAxiosPrivate()
    const [entity, setEntity] = useState({})
    const {auth} = useAuth()

    useEffect(() => {
        const fetchEntity = async () => {
            const res = await api.get(`/places/${name}`)
            console.log(res.data)
            setEntity(res.data)
            //DE CALCULAT RATING SI NR RECENZII
            //setEntity(res.data)
        }

        fetchEntity()
        console.log(auth)
    }, [])

  return (
    <section className=' '>
        <section className=' p-5'>
            <h2 className='text-3xl font-bold text-center py-5'>{entity.name}</h2>

            <section className='flex flex-row overflow-auto my-5'>
                {entity?.Images?.map((img, index) => <img key={index} src={`http://localhost:5000/uploads/${img?.imgUrl}`} />)}
            </section>

            <p className='text-xl py-3'>{entity.description}</p>

            {auth?.accessToken
            ?<section>
                <Button >Adauga la 'De vizitat'</Button>
                <Button >Adauga la 'Vizitate'</Button>
            </section>
            : null}
                
            

            
        </section>
        
        

        <section className='bg-gray-900 p-5'>
            {auth?.accessToken 
            ?<ReviewForm entityName={name}/>
            :<p className='text-gray-300 text-2xl p-5'><NavLink to='/login' className='font-bold text-amber-500 hover:cursor-pointer'>Autentifica-te</NavLink> pentru a putea lasa recenzii</p>}
            
            {entity?.Reviews?.map((review, index) => <Review key={index} {...review}/>)}
        </section>
    </section>
  )
}

export default Entity