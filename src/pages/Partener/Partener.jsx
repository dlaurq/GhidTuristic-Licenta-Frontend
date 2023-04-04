import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import NewEntityForm from './components/NewEntityForm'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import jwt_decode from "jwt-decode"
import useAuth from '../../hooks/useAuth'
import EntityCard from '../../components/EntityCard'
import ConfBox from '../../components/ConfBox'

const Partener = () => {

  const [toggleForm, setToggleForm] = useState(false)
  const [entities, setEntities] = useState([])
  const [showConfBox, setShowConfBox] = useState(false)
  const [showEditBox, setShowEditBox] = useState(false)

  const { auth } = useAuth()

  const api = useAxiosPrivate()

  const toggleShowConfBox = () => setShowConfBox(prev => !prev)

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
  }, [showEditBox])



  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/places/${id}`)
      const newEntities = entities.filter(review => review.id !== id)
      setEntities(newEntities)
      //console.log(id)      
      //console.log(res)      
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <section className='bg-gray-900 text-center'>

      <Button 
        className="m-5"
        handleClick={ () => setToggleForm(prevToggleForm => !prevToggleForm)}
      >
        Creaza o noua entitate
      </Button>

      {toggleForm ? <NewEntityForm /> : null}

      <hr />

      {entities.length === 0 
        ? <h3 className='text-gray-300'>Nu aveti nici o entitate inregistrata</h3>
        : entities.map((entity, index) => entity.id !== showEditBox 
            ?<EntityCard key={entity.name} name={entity.name} >
              <section className='flex flex-row justify-between items-center'>
                <Button handleClick={() => setShowEditBox(entity.id)}>Editeaza</Button>
                <Button handleClick={toggleShowConfBox}>Sterge</Button>
                {showConfBox && <ConfBox handleNo={toggleShowConfBox} handleYes={() => handleDelete(entity.id)} >Confirmati stergerea?</ConfBox>}
              </section>
            </EntityCard>
            :<NewEntityForm key={entity.name} entity={entity} submitTxt="Salveaza" update={true} hideForm={() => setShowEditBox(false)} setEntities={setEntities}>
              <section>
                <Button className="w-full" handleClick={() => setShowEditBox(false)}>
                  Cancel
                </Button>
              </section>
            </NewEntityForm>
          )
      }

    </section>
  )
}

export default Partener