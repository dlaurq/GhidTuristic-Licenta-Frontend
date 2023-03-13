import React from 'react'
import Button from '../../components/Button'
import NewEntityForm from './components/NewEntityForm'

const Partener = () => {
  return (
    <section className='bg-gray-900 text-center'>
        <Button>Creaza o noua entitate</Button>
        <NewEntityForm/>
    </section>
  )
}

export default Partener