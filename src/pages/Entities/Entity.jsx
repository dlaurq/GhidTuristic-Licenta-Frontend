import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import ReviewForm from './components/ReviewForm'
const Entity = (props) => {

    const {name} = useParams()
    const api = useAxiosPrivate()
    const [entity, setEntity] = useState({})

    useEffect(() => {
        const fetchEntity = async () => {
            const res = await api.get(`/places/${name}`)
            //DE CALCULAT RATING SI NR RECENZII
            setEntity(res.data)
        }

        fetchEntity()
    }, [])

  return (
    <section>
        <h2>{entity.name}</h2>
        {/**GALERIO FOTO */}
        <section>
            <p>Rating: </p>
            <p>Recenzii: </p>
        </section>
        <p>{entity.description}</p>
        <Button >Add to</Button>
        {/** recenzii */}

        <section>
            <ReviewForm />
        </section>
    </section>
  )
}

export default Entity