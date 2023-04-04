import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import NewEntityForm from './components/NewEntityForm'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import jwt_decode from "jwt-decode"
import useAuth from '../../hooks/useAuth'
import EntityCard from '../../components/EntityCard'

const Partener = () => {

  const [toggleForm, setToggleForm] = useState(false)
  const [entities, setEntities] = useState([])

  const { auth } = useAuth()

  const api = useAxiosPrivate()

  useEffect(() => {
    const fetchEntities = async () => {
      const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

      const username = decoded.UserInfo.username

      const res = await api.get(`/places/user/${username}`)
      console.log(res.data)
      setEntities(res.data)
    }

    fetchEntities()
  }, [])

  return (
    <section className='bg-gray-900 text-center'>

      <Button 
        className="m-5"
        handleClick={ () => setToggleForm(prevToggleForm => !prevToggleForm)}
      >
        Creaza o noua entitate
      </Button>

      {toggleForm ? <NewEntityForm/> : null}

      <hr />

      {entities.length === 0 
        ? <h3 className='text-gray-300'>Nu aveti nici o entitate inregistrata</h3>
        : entities.map(entity => <EntityCard key={entity.id} name={entity.name} />)
      }

    </section>
  )
}

export default Partener