import Button from "../../../../components/Button"
import ConfBox from "../../../../components/ConfBox"

const County = ({county, handleDelete, handleEdit,handleUpdate,toggleConfDelBox}) => {
  
  return (
    <section className="flex flex-row justify-between p-5 items-center border-b border-gray-300">
      {county.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
        <h3 className="text-2xl break-all">{county.name}</h3>
        <div className="flex flex-row">
            <Button handleClick={handleEdit} classes='mx-1'>Edit</Button>
            <Button handleClick={toggleConfDelBox} classes='mx-1'>Delete</Button>
        </div>
    </section>
  )
}

export default County