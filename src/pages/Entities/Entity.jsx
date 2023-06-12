import React, { useEffect, useState } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Review from '../../components/Review'
import ReviewForm from './components/ReviewForm'
import useAuth from '../../hooks/useAuth'
import ConfBox from '../../components/ConfBox'

const Entity = (props) => {

    const {name} = useParams()
    const api = useAxiosPrivate()
    const [entity, setEntity] = useState({PlacesToVisits: [], PlacesVisiteds: []})
    const {auth} = useAuth()
    const [showConfBox, setShowConfBox] = useState(false)


    const fetchEntity = async () => {
        const res = await api.get(`/places/${name}`)
        console.log(res.data)
        setEntity(res.data)
        //DE CALCULAT RATING SI NR RECENZII
        //setEntity(res.data)
    }

    useEffect(() => {
        fetchEntity()
        console.log(entity)
    }, [])

    const handleVisitedBtn = async () => {
        try{
            //console.log(auth?.username, entity?.id)
            const res = await api.post('/visited', {username: auth?.username, place: entity?.id})
            //console.log(res.data)
            fetchEntity()
        }catch (err){
            console.log(err)
        }
    }

    const handleToVisitBtn = async () => {
        try{
            //console.log(auth?.username, entity?.id)
            const res = await api.post('/toVisit', {username: auth?.username, place: entity?.id})
            //.log(res.data)
            fetchEntity()
        }catch (err){
            console.log(err)
        }
    }

    const handleDeleteReview = async (id) => {
        console.log(id)
        
        try {
            const res = await api.delete(`/reviews/${id}`)
            fetchEntity()
        } catch (err) {
            console.log(err)
        }
        
    }

    const calcRating = (reviews) => {
        let sum = 0
        reviews?.forEach(review => sum += parseFloat(review?.rating));
        return sum / reviews?.length
        }

  return (
    <section className='sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem]'>
        <section className=' p-5'>
            <h2 className='text-3xl font-bold pt-5'>{entity.name}</h2>

            <p className="text-xl"> {entity?.Category?.name} &#x2022; Rating {calcRating(entity?.Reviews) || 0} </p>

            <section className='flex flex-row overflow-auto my-5 gap-5'>
                {entity?.Images?.map((img, index) => <img key={index} src={`http://localhost:5000/uploads/${img?.imgUrl}`} className='md:max-h-80 max-h-64 object-contain' />)}
            </section>

            <p className='text-xl py-3'>{entity.description}</p>

            {auth?.accessToken
            ?<section className='sm:flex sm:flex-row sm:gap-5 sm:justify-between'>
                
                {entity?.PlacesToVisits?.length === 0 || !entity?.PlacesToVisits?.some(place => place?.User?.username === auth?.username)
                    ? <button type="button" className="bg-gray-900 my-2 w-full text-left pl-5" onClick={handleToVisitBtn}>Adauga la 'De vizitat'</button>
                    : undefined
                }
                
                {entity?.PlacesToVisits?.length === 0 || !entity?.PlacesVisiteds?.some(place => place?.User?.username === auth?.username)
                    ? <button type="button" className="bg-gray-900 my-2 w-full text-left pl-5" onClick={handleVisitedBtn}>Adauga la 'Vizitate'</button>
                    : undefined
                }

            </section>
            : null}
                
            

            
        </section>
        
        

        <section className='p-5 '>
            {!auth?.accessToken 
            ?<p className='text-gray-300 text-2xl p-5'><NavLink to='/login' className='font-bold text-amber-500 hover:cursor-pointer'>Autentifica-te</NavLink> pentru a putea lasa recenzii</p>
            :entity?.Reviews?.find(review => review?.User?.username === auth?.username)
            ?entity?.Reviews?.map((review, index) => review?.User?.username === auth?.username && 
                <Review key={index} review={review}>
                    <section className="mt-5">
                        <button type="button" onClick={() => setShowConfBox(prev => !prev)} className="w-full text-gray-900 border-gray-900 border-2 font-bold">Sterge recenzia</button>
                        {showConfBox  && <ConfBox handleNo={() => setShowConfBox(prev => !prev)} handleYes={() => handleDeleteReview(review.id)} >Confirmati stergerea?</ConfBox>}
                    </section>
                </Review>)
            :<ReviewForm fetchEntity={fetchEntity} entityName={name}/>}
            
            {entity?.Reviews?.map((review, index) => review?.User?.username !== auth?.username && <Review key={index} review={review}/>)}
        </section>
    </section>
  )
}

export default Entity