

const Button = ({handleClick, classes, children, type = 'button'}) => {
  return (
    <button type={type} onClick={handleClick} className={`p-2 text-xl text-gray-300 border ${classes}`}>
        {children}
    </button>
  )
}

export default Button