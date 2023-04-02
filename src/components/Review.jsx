import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating } from 'react-simple-star-rating'


const Review = ({ title, createdAt, rating, User, description, Images, children }) => {
  return (
    <section className='p-5 mb-5 border-4 last:mb-0 border-amber-500 bg-white'>
      <section className='flex flex-row justify-start items-center mb-2'>
        <FontAwesomeIcon icon={faUser} className="mr-5 text-4xl"/>
        <section>
          <p className='font-bold'>{User.username} </p>
          <p>{new Date(createdAt).toLocaleDateString('ro-RO')}</p>
        </section>
      </section>
      <section className='mb-2'>
        <Rating initialValue={rating} SVGstyle={{display: 'inline-block'}} style={{pointerEvents: 'none'}}/>
      </section>
      
      <section className='mb-4'>
        <h4 className='font-bold text-2xl'>{title}</h4>
        <p className='text-xl'>{description}</p>
      </section>
     
      <section className='flex gap-2 flex-col'>
          {Images?.map((img, index) => <img key={index} src={`http://localhost:5000/uploads/${img?.imgUrl}`} />)}
      </section>

      {children}
    </section>
  )
}

export default Review