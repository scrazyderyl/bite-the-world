import { Link } from "react-router";

import './Navbar.css';

function Navbar({ user, handleLogout }) {
    return (
    <nav>
        <div className="group align-left">
            <Link to='/'>
                <p className="site-name">Bite the World</p>
            </Link>
        </div>
        <div className="group align-center">
            <Link to='/'>
                <button className="link underline-hover">Map</button>
            </Link>
            <Link to='/ingredients'>
                <button className="link underline-hover">Search</button>
            </Link>
        </div>
        <div className="group align-right">
            {user ? (
                <>
                    <Link to='/recipes/new'>
                        <button className="link new-recipe">New Recipe</button>
                    </Link>
                    <Link to='/user'>
                        <button className="link underline-hover">{ user.displayName.split(" ")[0] }</button>
                    </Link>
                    <button onClick={handleLogout} className="link">Logout</button>
                </>
            ) : (
                <Link to='/login'>
                    <button className="link">Login</button>
                </Link>
            )}
        </div>
    </nav>
    );
}

export default Navbar;