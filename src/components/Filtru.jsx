import React from 'react'

const Filtru = ({text, handleChange, list, placeholder, value}) => {
  return (
    <section className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] px-5 py-3 text-white flex flex-col justify-between items-start text-2xl bg-gray-900">
        <p>{text}</p>
        <select name="filtru" id="filtru" onChange={handleChange} className='text-gray-900' value={value}>
            <option value="">{placeholder}</option>
            {list.map(item => 
                <option key={item.id} value={item.id}>
                {item.name}
                </option>
            )}
        </select>
    </section>
  )
}

export default Filtru