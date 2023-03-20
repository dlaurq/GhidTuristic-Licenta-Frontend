

const Button = ({handleClick, className, children, type = 'button'}) => {
  return (
    <button type={type} onClick={handleClick} className={`p-2 text-xl text-gray-300 border ${className}`}>
        {children}
    </button>
  )
}

export default Button