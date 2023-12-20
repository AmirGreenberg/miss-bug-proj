import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function UserDetails() {
    const [user, setUser] = useState(userService.getLoggedinUser())
    console.log('🚀  user:', user)
    const navigate = useNavigate()

    function onBack() {
        navigate('/')
    }

    if (!user) return <h1>Loading....</h1>
    return (
        user && (
            <div>
                <h3>Welcom back {user.fullname} 🐛</h3>

                {user.isAdmin && (<h4>You are admin</h4>)}

                <p>
                    id: <span>{user._id}</span>
                </p>

                <button onClick={onBack}>Back</button>
            </div>
        )
    )
}
