import { useNavigate } from "react-router-dom"
import Button from "../../../../components/Button"
import ConfBox from "../../../../components/ConfBox"
import CountryForm from "./CountryForm"


const Country = ({country, handleDelete, handleEdit,handleUpdate, toggleConfDelBox}) => {

  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/County', {state: {...country}})
  }

  return (
    <>
    {!country.edit ?
        <section className="flex flex-row justify-between p-5 items-center border-b border-gray-300">
          {country.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick}  className="text-2xl text-gray-300 break-all">{country.name} ({country?.Counties?.length || 0})</h3>
          <div className="buttons">
            <Button handleClick={handleEdit} className='mx-1'>Edit</Button>
            <Button handleClick={toggleConfDelBox} className='mx-1'>Delete</Button>
          </div>
        </section>
      :
      <CountryForm buttonText='Edit' handleSubmit={handleUpdate} country={country}/>}
  </>
  )
}

export default Country