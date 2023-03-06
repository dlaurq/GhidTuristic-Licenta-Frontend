import Button from "./Button"

const ConfBox = ({handleYes, handleNo, children, }) => {

  return (
    
    <section onClick={handleNo} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex flex-col items-center justify-center bg-transparent">
        <section className="bg-gray-900 border-2 p-5 w-4/5 shadow-sm shadow-black flex flex-col justify-between">
            <p className=" text-center mb-8 text-xl text-gray-300">{children}</p>
            <section className="flex flex-row justify-evenly items-center">
                <Button handleClick={handleYes} classes="px-4">Da</Button>
                <Button handleClick={() => handleNo} classes="px-4">Nu</Button>
            </section>
        </section>
    </section>
  )
}

export default ConfBox