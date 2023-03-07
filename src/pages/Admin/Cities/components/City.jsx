import Button from "../../../../components/Button"
import ConfBox from "../../../../components/ConfBox"
import CityForm from "./CityForm"

const City = ({city, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, counties, classes}) => {
  
  return (
    <>{!city.edit 
      ?<section className={`flex flex-row justify-between p-5 items-center border-b border-gray-300 ${classes}`}>
        {city.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 className="text-2xl break-all">{city.name}</h3>
          <div className="flex flex-row">
              <Button handleClick={handleEdit} classes='mx-1'>Edit</Button>
              <Button handleClick={toggleConfDelBox} classes='mx-1'>Delete</Button>
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