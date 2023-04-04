import { useState } from "react"
import { useEffect } from "react"
import Button from "../../../components/Button"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { faCaretDown, faCaretUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Review from "../../../components/Review"
import ConfBox from "../../../components/ConfBox"
import Input from "../../../components/Input"
import { useLocation, useNavigate } from "react-router-dom"


const Users = () => {

    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState('')
    const [filterUsers, setFilterUsers] = useState(users)
    

    const api = useAxiosPrivate()
    const location = useLocation()

    useEffect(() => {
        setFilter(location?.state?.search || '')

        const fetchUsers = async () => {
            try {
                const res = await api.get('/users')
                setUsers(res.data)
                setFilterUsers(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        const newUsers = users.filter(user => user.username.toLowerCase().includes(filter.toLowerCase()))
        setFilterUsers(newUsers)
    }, [filter, users])

    const handleDeleteUser = async (username) => {
        try {
            const res = await api.delete(`/users/${username}`)
            const newUsers = users.filter(user => user.username !== username)
            setUsers(newUsers)
        } catch (err) {
            console.log(err)
        }
    }

    

  return (
    <section>

        <section className="p-5 bg-gray-900 text-gray-300 flex flex-row justify-between items-center gap-5">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <Input 
            id="filterBar"
            name="filterBar"
            placeholder="Nume utilizator"
            value={filter}
            handleChange={(e) => setFilter(e.target.value)}
            />
        </section>

        <hr />

        {filterUsers?.map(user => <User key={user.username} {...user} Entities={user.Places} handleDeleteUser={handleDeleteUser} />)}
        
    </section>
  )
}


const User = ({firstName, lastName, username, email, phoneNR, bio, Roles, Reviews, Entities, Image, handleDeleteUser}) => {

    const [showUserDetails, setShowUserDetails] = useState(false)
    const [showEntitiesDetails, setShowEntitiesDetails] = useState(false)
    const [showReviewsDetails, setShowReviewsDetails] = useState(false)
    const [showConfBox, setShowConfBox] = useState(false)
    const [reviews, setReviews] = useState(Reviews)
    const [roles, setRoles] = useState(Roles)

    const api = useAxiosPrivate()
    const navigate = useNavigate()

    const toggleShowUserDetails = () => setShowUserDetails(prev => !prev)
    const toggleShowEntitiesDetails = () => setShowEntitiesDetails(prev => !prev)
    const toggleShowReviewsDetails = () => setShowReviewsDetails(prev => !prev)
    const toggleShowConfBox = () => setShowConfBox(prev => !prev)
    
    const handleDeleteReview = async (id) => {
        try {
            const res = await api.delete(`/reviews/${id}`)
            const newReviews = reviews.filter(review => review.id !== id)
            setReviews(newReviews)
        } catch (err) {
            console.log(err)
        }
    }

    const handlePromote = async () => {
        try {
            const res = await api.patch('/users/partener', {username: username})
            if(roles?.find(role => role.name === '1337')){
                const newRoles = roles?.filter(role => role.name !== '1337')
                setRoles(newRoles)
            }else setRoles(prev => [...prev, {name: '1337'}])
            
        } catch (err) {
            console.log(err)
        }
    }

    return(
        <section className="p-5 bg-gray-900 text-gray-300 text-xl border-b-2">
            {!showUserDetails 
                ?<section className="flex flex-row justify-between items-center text-2xl">
                    <section className="flex flex-row justify-between items-center">
                        <FontAwesomeIcon icon={faUser}/>
                        <h3 className="pl-5">{username}</h3>
                    </section>
                    <p onClick={toggleShowUserDetails}><FontAwesomeIcon icon={faCaretUp}/></p>
                </section>
                :<section className="flex flex-col gap-4">
                    <section className="flex flex-row justify-between items-center text-2xl ">
                        <FontAwesomeIcon icon={faUser}/>
                        <p onClick={toggleShowUserDetails}><FontAwesomeIcon icon={faCaretDown}/></p>
                    </section>

                    <h3 className="text-2xl">{username}</h3>
                    <p>Nume: {firstName} {lastName}</p>
                    <p>Bio: {bio}</p>
                    <p>Email: {email}</p>
                    <p>Nr. Tel: {phoneNR}</p>
                    
                    <Button handleClick={handlePromote} >{ roles?.find(role => role.name === '1337') ? "Retrigradeaza la utilizator" : "Promovati ca partener"}</Button>
                    <Button handleClick={toggleShowConfBox} >Sterge profilul</Button>
                    {showConfBox && <ConfBox handleNo={toggleShowConfBox} handleYes={() => handleDeleteUser(username)} >Confirmati stergerea?</ConfBox>}

                    <hr />
                    {/**Lista entitati */}
                    {!showEntitiesDetails
                        ?<section className="flex flex-row justify-between items-center">
                            <p>Entitati: {Entities.length}</p>
                            <p onClick={toggleShowEntitiesDetails}><FontAwesomeIcon icon={faCaretUp}/></p>
                        </section>
                        :<section>
                            <section className="flex flex-row justify-between items-center mb-5">
                                <p>Entitati: {Entities.length}</p>
                                <p onClick={toggleShowEntitiesDetails}><FontAwesomeIcon icon={faCaretDown}/></p>
                            </section>
                            <section>
                                {Entities.map((entity, index) => 
                                    <section key={index} onClick={() => navigate('/admin/entities', {state: {search: entity.name}})}>
                                        <p>{entity.name}</p>
                                    </section>
                                    )}
                            </section>
                        </section>
                    }
                    <hr />

                    {/**Lista recenzii */}
                    {!showReviewsDetails
                        ?<section className="flex flex-row justify-between items-center">
                            <p>Recenzii: {reviews.length}</p>
                            <p onClick={toggleShowReviewsDetails}><FontAwesomeIcon icon={faCaretUp}/></p>
                        </section>
                        :<section>
                            <section className="flex flex-row justify-between items-center mb-5">
                                <p>Recenzii: {reviews.length}</p>
                                <p onClick={toggleShowReviewsDetails}><FontAwesomeIcon icon={faCaretDown}/></p>
                            </section>
                            <section className="text-gray-900">
                                {reviews?.map((review, index) => 
                                    <Review key={index} {...review}>
                                        <section className="mt-5">
                                            <Button handleClick={toggleShowConfBox} className="w-full text-gray-900 border-gray-900 border-2 font-bold">Sterge recenzia</Button>
                                            {showConfBox && <ConfBox handleNo={toggleShowConfBox} handleYes={() => handleDeleteReview(review.id)} >Confirmati stergerea?</ConfBox>}
                                        </section>
                                    </Review>)}
                            </section>
                        </section>
                    }
                </section>
            }
        </section>
    )
}


export default Users