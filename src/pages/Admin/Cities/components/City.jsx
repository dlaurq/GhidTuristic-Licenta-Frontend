import { useNavigate } from "react-router-dom"
import Button from "../../../../components/Button"
import ConfBox from "../../../../components/ConfBox"
import CityForm from "./CityForm"

const City = ({city, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, counties, className}) => {
  
  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/Locations', {state: {...city}})
  }

  return (
    <>{!city.edit 
      ?<section className={`flex flex-row justify-between p-5 items-center border-b border-gray-300 ${className}`}>
        {city.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick} className="text-2xl break-all">{city.name} ({city?.Locations?.length || 0})</h3>
          <div className="flex flex-row">
              <Button handleClick={handleEdit} className='mx-1'>Edit</Button>
              <Button handleClick={toggleConfDelBox} className='mx-1'>Delete</Button>
          </div>
      </section>

      :<CityForm 
      city={city}
      counties={counties}
      buttonText='Salvati'
      handleSubmit={handleUpdate}
      />}
    </>
  )
}

export default City