import { Rating } from 'react-simple-star-rating'

const Review = ({ title, createdAt, rating, username, description, Images }) => {

  return (
    <section className=''>
        <h4>{title}</h4>
        <p>{createdAt}</p>
        <Rating initialValue={rating} SVGstyle={{display: 'inline-block'}} style={{pointerEvents: 'none'}}/>
        <p>{username} </p>
        <p>{description}</p>
        <section>
            {Images?.map((img, index) => <img key={index} src={`http://localhost:5000/uploads/${img?.imgUrl}`} />)}
        </section>
    </section>
  )
}

export default Review