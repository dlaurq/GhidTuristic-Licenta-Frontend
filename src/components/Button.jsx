

const Button = ({handleClick, children, type = 'button'}) => {
  return (
    <button type={type} onClick={handleClick} className='p-2 text-xl text-gray-300 border m-1'>
        {children}
    </button>
  )
}

export default Button