import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { forwardRef, useImperativeHandle, useState } from "react"

const DropDownForm = forwardRef(({text, form}, ref) => {

  const [showForm, setShowForm] = useState(false)

  useImperativeHandle(ref, () => ({
    handleForm() { 
      setShowForm(prev => !prev)
    }

  }))


  return (
    <section className="bg-white ">
        <section 
          onClick={() => setShowForm(prev => !prev)} 
          className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] p-5 text-white flex flex-row justify-between items-center text-2xl bg-gray-900">
          <p className="">{text}</p>
          <FontAwesomeIcon icon={showForm ? faCaretDown : faCaretUp} />
        </section>
        {showForm && form}
      </section>
  )
})

export default DropDownForm