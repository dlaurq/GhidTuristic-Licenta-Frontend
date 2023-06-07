import React from 'react'
import ConfBox from './ConfBox'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const AdminItem = ({ item, toggleConfDelBox, handleDelete, handleNavigate, subItemsLength, handleEdit, form, className}) => {
  return (
    <>{
        !item.edit 
            ? <section className={`last:border-0 sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] flex flex-row justify-between p-5 items-center text-gray-900 bg-white border-gray-900 border-b-2 ${className}`}>
                {item.deleteBox && <ConfBox handleNo={toggleConfDelBox} handleYes={handleDelete}>Confirmare stergere?</ConfBox>}
                <h3 onClick={handleNavigate}  className="text-2xl break-all">
                    {item?.name || item?.address} ({subItemsLength || 0})
                </h3>
                <section className=" text-3xl flex flex-row justify-between items-center gap-5">
                    <FontAwesomeIcon icon={faPenToSquare} className='cursor-pointer pl-5' onClick={handleEdit}/>
                    <FontAwesomeIcon icon={faX} className='cursor-pointer' onClick={toggleConfDelBox}/>
                </section>
            </section>
            : form
    }</>
  )
}

export default AdminItem