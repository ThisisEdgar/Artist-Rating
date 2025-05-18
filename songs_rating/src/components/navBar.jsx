import { Link } from 'react-router-dom'

const NavBar = () => {
  return (<nav className="navbar">
    <img src='https://cdn-icons-png.flaticon.com/512/9448/9448086.png' height="40px" width="10px" alt='my logo' id='navigationBar'/>
 <div className="navbar-container">
    
    <Link className="navbar-link" to="/">Artists</Link>
    <Link className="navbar-link" to="songs">Songs</Link>
    <Link className="navbar-link" to="admin">Admin</Link>
 </div>
</nav>);
}
export default NavBar;   