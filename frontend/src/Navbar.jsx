import { Link } from "react-router";

function Navbar({ user, handleLogout }) {
    return <nav style={styles.nav}>
        <ul style={styles.ul}>
            <li style={styles.li}>
                <Link to='/'>
                    <button style={styles.link}>
                        Map
                    </button>
                </Link>
            </li>
            <li style={styles.li}>
                <Link to='/user'>
                    <button style={styles.link}>
                        User
                    </button>
                </Link>
            </li>
            {user && (
                <li style={styles.li}>
                    <button onClick={handleLogout} style={styles.link}>
                        Logout
                    </button>
                </li>
            )}
        </ul>
    </nav>
}

const styles = {
    nav: {
        backgroundColor: '#333',
        padding: '10px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    ul: {
        listStyle: 'none',
        display: 'flex',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
    },
    li: {
        margin: '0 15px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '18px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    },
}

export default Navbar;