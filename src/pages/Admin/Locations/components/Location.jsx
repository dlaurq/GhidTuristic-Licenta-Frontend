import { useNavigate } from "react-router-dom"
import Button from "../../../../components/Button"
import ConfBox from "../../../../components/ConfBox"
import LocationForm from "./LocationForm"

const Location = ({location, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, cities, className}) => {
  
  const naviage = useNavigate()

  const handleClick = () => {
    naviage(`/admin/${location?.Users[0]?.username ? 'Users' : 'entities'}`, {state: {search: (location?.Users[0]?.username || location?.Places[0]?.name)}})
  }

  return (
    <>{!location.edit 
      ?<section className={`flex flex-row justify-between p-5 items-center border-b border-gray-300 ${className}`}>
        {location.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick} className="text-2xl break-all">{location.address} ({location?.Users[0]?.username || location?.Places[0]?.name || ' '})</h3>
          <div className="flex flex-row">
            {/** 
              <Button handleClick={handleEdit} className='mx-1'>Edit</Button>
            */}
              <Button handleClick={toggleConfDelBox} className='mx-1'>Delete</Button>
          </div>
      </section>

      :<LocationForm 
      location={location}
      cities={cities}
      buttonText='Salvati'
      handleSubmit={handleUpdate}
      />}
    </>
  )
}

export default Location