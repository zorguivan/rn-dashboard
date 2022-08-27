import React, {useState, useContext, useEffect} from 'react';
import { useHistory } from "react-router-dom"
import { Table, Button } from 'reactstrap';

import { HotelContext } from '../context/HotelState';

const Hotels = (props) => {
  const {getHotels, ...hotelsState} = useContext(HotelContext);
  const [loadingStatus, setloadingStatus] = useState(false);
  const [hotelsList, setHotelsList] = useState(false);


  const history = useHistory();

  useEffect(() => {
    if(!localStorage.getItem('user')){
      history.push('/login');
    } else { 
        setloadingStatus(true)
        getHotels().then((hotels) => {
          setHotelsList(hotels)
          setloadingStatus(false)
        })
    }
  }, [localStorage.getItem('user')]);

  const logout = () => {
    localStorage.clear();
  }

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hours: 'numeric', minutes: 'numeric'};

  return (
    <div className="App">
      <header className="header_new py-2 position-relative">
      <nav
        className="navbar navbar-light navbar-expand-md bg-faded justify-content-center"
      >
        <div className="container d-flex mobile-grid gap-2">
          <a href="/" className="navbar-brand text-center"
            ><img src="./images/logo.svg" className="nav-logo" alt="Logo" /></a
          ><button
            className="navbar-toggler order-first order-md-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mynavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="header-chat-btn d-md-none">
            <a href="/about-us" title="" className="d-inline-block">Log Out</a>
          </div>
          <div className="collapse navbar-collapse w-100" id="mynavbar">
            <ul className="navbar-nav w-100 justify-content-center">
              <li className="nav-item active">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./hotels">Liste des hôtels</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="./messages">Messages</a>
              </li>
            </ul>
          </div>
          <div className="header-chat-btn d-none d-md-block">
            <a href="" onClick={() => logout()} title="">Log Out</a>
          </div>
        </div>
      </nav>
    </header>
      <div className="container hotelscontainer">
        {loadingStatus && <div className="loaderContainer"><div className="spinner-border text-primary mx-auto" role="status">
            <span className="sr-only">Loading...</span>
          </div></div>  || 
      <table className="table table-bordered table-hover" style={{marginTop: "80px"}}>
        <thead>
          <tr>
            <th>Nom de l'Hotel</th>
            <th>Emplacement</th>
            <th>N de chambres</th>
            <th>Ouvrir</th>
          </tr>
        </thead>
        <tbody>
            {hotelsList && hotelsList.map((hotel, index) => {
                return <tr key={index}>
                    <td>{hotel.name}</td>
                    <td>{hotel.location}</td>
                    <td>{hotel.rooms.length}</td>
                    <td><a href={`/hotel/${hotel._id}`} className="btn btn-primary"><i class="fa-solid fa-eye"></i></a></td>
                </tr>
            })}
          
        </tbody>
      </table>
    }
      </div>
      <footer className="footer-main footer shadow-lg">
      <a href="#" title="" className="bottom-to-top-btn"
        ><i className="fas fa-chevron-up"></i><span>TOP</span></a
      >
      <div
        className="container d-flex justify-content-between align-items-center flex-column flex-xl-row"
      >
        <figure><img src="./images/logo.svg" alt="logo" className="footer-logo"/></figure>
      </div>
    </footer>
    </div>

  )
}



export default Hotels;
