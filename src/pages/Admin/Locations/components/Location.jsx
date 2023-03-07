import Button from "../../../../components/Button"
import ConfBox from "../../../../components/ConfBox"
import LocationForm from "./LocationForm"

const Location = ({location, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, cities, classes}) => {
  
  return (
    <>{!location.edit 
      ?<section className={`flex flex-row justify-between p-5 items-center border-b border-gray-300 ${classes}`}>
        {location.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 className="text-2xl break-all">{location.address}</h3>
          <div className="flex flex-row">
              <Button handleClick={handleEdit} classes='mx-1'>Edit</Button>
              <Button handleClick={toggleConfDelBox} classes='mx-1'>Delete</Button>
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