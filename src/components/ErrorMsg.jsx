import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons/index"
import { useEffect } from "react"
import { useState } from "react"

const ErrorMsg = ({text = ' test', bgColor = "bg-red-600", setServerResp}) => {

  const [show, setShow] = useState(true)

  useEffect(() => {
    console.log(text)

    const timer = setTimeout(() => {
      setShow(false)
      setServerResp(prev => ({...prev, show: false}))
    }, 3000)

    return () => clearTimeout(timer)
  },[])

  const handleClick = () => {
    setShow(false)
    setServerResp(prev => ({...prev, show: false}))
  }

  if(!show) return null

  return (
    <section onClick={handleClick} className={`fixed w-screen bottom-0 ${bgColor} text-white cursor-pointer`}>
      <section className="flex flex-row px-5 py-3 justify-between items-center text-2xl font-bold">
        <p>{text}</p>
        <FontAwesomeIcon icon={faX}/>
      </section>
    </section>
  )
}

export default ErrorMsg