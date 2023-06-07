import { useState } from "react"
import { useEffect } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { faCaretDown, faCaretUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Review from "../../components/Review"
import ConfBox from "../../components/ConfBox"
import { useLocation, useNavigate } from "react-router-dom"
import SearchBar from "../../components/SearchBar"


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
                console.log(res.data)
                setFilterUsers(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        const newUsers = users?.filter(user => user.username.toLowerCase().includes(filter.toLowerCase()))
        setFilterUsers(newUsers)
    }, [filter, users])

    const handleDeleteUser = async (username) => {
        try {
            const res = await api.delete(`/users/${username}`)
            const newUsers = users?.filter(user => user.username !== username)
            setUsers(newUsers)
        } catch (err) {
            console.log(err)
        }
    }

    

  return (
    <section>

        <SearchBar list={users} setFilterList={setFilterUsers} compare='username' />

        {filterUsers?.map(user => <User key={user?.username} {...user} Entities={user?.Places} handleDeleteUser={handleDeleteUser} />)}
        
    </section>
  )
}


const User = ({firstName, lastName, username, email, phoneNR, bio, Roles, Reviews, Entities, Image, handleDeleteUser}) => {

    const [showUserDetails, setShowUserDetails] = useState(false)
    const [showEntitiesDetails, setShowEntitiesDetails] = useState(false)
    const [showReviewsDetails, setShowReviewsDetails] = useState(false)
    const [showConfBox, setShowConfBox] = useState('')
    const [reviews, setReviews] = useState(Reviews)
    const [roles, setRoles] = useState(Roles)

    const api = useAxiosPrivate()
    const navigate = useNavigate()

    const toggleShowUserDetails = () => setShowUserDetails(prev => !prev)
    const toggleShowEntitiesDetails = () => setShowEntitiesDetails(prev => !prev)
    const toggleShowReviewsDetails = () => setShowReviewsDetails(prev => !prev)
    //const toggleShowConfBox = () => setShowConfBox(prev => !prev)
    
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
        <section className="">
            {!showUserDetails 
                ?<section className=" sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] flex flex-row justify-between p-5 items-center text-gray-900 bg-white border-gray-900 border-b-2 text-2xl">
                    <section className="flex flex-row justify-between items-center">
                        <FontAwesomeIcon icon={faUser}/>
                        <h3 className="pl-5">{username}</h3>
                    </section>
                    <p onClick={toggleShowUserDetails}><FontAwesomeIcon icon={faCaretUp}/></p>
                </section>
                :<section className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] flex flex-col gap-4 text-xl p-5 border-4 border-amber-500 my-5">
                    <section className="flex flex-row justify-between items-center text-2xl ">
                        <FontAwesomeIcon icon={faUser}/>
                        <p onClick={toggleShowUserDetails}><FontAwesomeIcon icon={faCaretDown}/></p>
                    </section>

                    <h3 className="text-2xl">@{username}</h3>
                    <p>Nume complet: {firstName} {lastName}</p>
                    <p>Bio: {bio}</p>
                    <p>Email: {email}</p>
                    <p>Nr. Tel: {phoneNR}</p>
                    
                    <section className="flex flex-col sm:flex-row items-stretch justify-start gap-5">
                        <button className="sm:px-5 bg-amber-500 text-left pl-5" type="button" onClick={handlePromote} >{ roles?.find(role => role.name === '1337') ? "Retrogradeaza la utilizator" : "Promovati ca partener"}</button>
                        <button className="sm:px-5    bg-red-500 text-left pl-5" type="button" onClick={() => setShowConfBox(username)} >Sterge profilul</button>
                    </section>

                    {showConfBox === username && <ConfBox handleNo={() =>setShowConfBox('')} handleYes={() => handleDeleteUser(username)} >Confirmati stergerea?</ConfBox>}

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
                                    <section key={index} onClick={() => navigate('/admin/entitati', {state: {search: entity.name}})}>
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
                            <section className="text-gray-900 lg:grid lg:grid-cols-2 lg:gap-2 xl:grid-cols-3 2xl:grid-cols-4 ">
                                {reviews?.map((review) => 
                                    <Review key={review.id} {...review}>
                                        <section className="mt-5">
                                            <button type="button" onClick={() => setShowConfBox(review)} className="w-full text-gray-900 border-gray-900 border-2 font-bold">Sterge recenzia</button>
                                            {showConfBox?.id === review.id && <ConfBox handleNo={() => setShowConfBox('')} handleYes={() => handleDeleteReview(review.id)} >Confirmati stergerea?</ConfBox>}
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