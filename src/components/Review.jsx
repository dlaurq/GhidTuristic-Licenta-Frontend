import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating } from 'react-simple-star-rating'

const Review = ({ children, review }) => {

  return (
    <section className='p-5 mb-5 border-4 last:mb-0 border-amber-500 bg-white flex flex-col justify-between lg:mb-0'>
      <section className='sm:flex sm:flex-row sm:justify-start sm:gap-5'>
        <section className='flex flex-row justify-start items-center mb-2'>
          <FontAwesomeIcon icon={faUser} className="mr-5 text-4xl"/>
          <section>
            <p className='font-bold'>{review.User.username} </p>
            <p>{new Date(review.createdAt).toLocaleDateString('ro-RO')}</p>
          </section>
        </section>
        <section className='mb-2'>
          <Rating initialValue={review.rating} SVGstyle={{display: 'inline-block'}} style={{pointerEvents: 'none'}}/>
        </section>
      </section>
      
      
      <section className='mb-4'>
        <h4 className='font-bold text-2xl'>{review.title}</h4>
        <p className='text-xl'>{review.description}</p>
      </section>
     
      <section className='flex gap-10 flex-col flex-wrap justify-start sm:flex-row'>
          {review.Images?.map((img, index) => <img className='sm:max-h-20 md:max-h-28 lg:max-h-36' key={index} src={`http://localhost:5000/uploads/${img?.imgUrl}`} />)}
      </section>

      {children}
    </section>
  )
}

export default Review