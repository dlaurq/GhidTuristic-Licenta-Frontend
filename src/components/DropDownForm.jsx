import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"

const DropDownForm = ({text, form}) => {

const [showForm, setShowForm] = useState(false)

  return (
    <section className="bg-white ">
        <section 
          onClick={() => setShowForm(prev => !prev)} 
          className="sm:mx-16 md:mx-28 lg:mx-36 px-5 py-3 text-white flex flex-row justify-between items-center text-2xl bg-gray-900">
          <p className="">{text}</p>
          <FontAwesomeIcon icon={showForm ? faCaretDown : faCaretUp} />
        </section>
        {showForm && form}
      </section>
  )
}

export default DropDownForm