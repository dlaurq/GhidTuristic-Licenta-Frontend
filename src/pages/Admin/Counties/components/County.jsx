import { useNavigate } from "react-router-dom"
import Button from "../../../../components/Button"
import ConfBox from "../../../../components/ConfBox"
import CountyForm from "./CountyForm"

const County = ({county, handleDelete, handleEdit, handleUpdate, toggleConfDelBox, countries, className}) => {
  
  const naviage = useNavigate()

  const handleClick = () => {
    naviage('/admin/City', {state: {...county}})
  }


  return (
    <>{!county.edit 
      ?<section className={`flex flex-row justify-between p-5 items-center border-b border-gray-300 ${className}`}>
        {county.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
          <h3 onClick={handleClick} className="text-2xl break-all">{county.name} ({county?.Cities?.length || 0})</h3>
          <div className="flex flex-row">
              <Button handleClick={handleEdit} className='mx-1'>Edit</Button>
              <Button handleClick={toggleConfDelBox} className='mx-1'>Delete</Button>
          </div>
      </section>

      :<CountyForm 
      county={county}
      countries={countries}
      buttonText='Salvati'
      handleSubmit={handleUpdate}
      />}
    </>
  )
}

export default County