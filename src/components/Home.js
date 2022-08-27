import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory, useParams } from "react-router-dom"
import {
  Col,
  Row,
  Card,
  Form,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap"

import { WithContext as ReactTags } from 'react-tag-input';

import Dropzone from "react-dropzone"

import { AuthContext } from '../context/AuthState';
import { HotelContext } from '../context/HotelState';



const Home = (props) => {
  const userData = useContext(AuthContext);
  const { addHotel, getHotel, saveHotel, removeHotel } = useContext(HotelContext);
  const [textData, setTextData] = useState("");
  const [loadingStatus, setloadingStatus] = useState(false);
  const handleTextChange = (newData) => {
    setTextData(newData);
  };

  const extraProps = {
    disabled: false,
  }

  useEffect(() => {
    console.log(textData);
  }, [textData]);

  const [hotel, setHotel] = useState({
    location: "Ariana"
  })
  const [userFile, setUserFile] = useState({})
  const [hotelImage, setHotelImage] = useState({})
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState({people: 1})
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [show, setShow] = useState(false);

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);


  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  let { hotelId } = useParams();

  useEffect(() => {
    getHotel(hotelId).then((res) => {
      if (res.msg != "Server error") {
        setHotel({
          ...hotel,
          name: res[0].name,
          location: res[0].location,
          description: res[0].description,
          image: res[0].image
        });
        setRooms(res[0].rooms)

        setTextData(res[0].text);
        //setSelectedFiles([{ name: "Hotel-" + res[0]._id, type: "image/jpeg", preview: res[0].image }])
        let tagsHolder = [];
        if (res[0].tags && res[0].tags.length > 0) {
          res[0].tags.forEach((tag) => {
            tagsHolder.push({ id: tag, text: tag });
          });
          setTags(tagsHolder);
        }
        // editorReference.focus()
        // document.getElementsByClassName('DraftEditor-root')[0].focus
      }
    });
  }, [hotelId]);

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      history.push('/login');
    }
  }, [localStorage.getItem('user')]);


  const KeyCodes = {
    comma: 188,
    enter: [10, 13],
  };

  const delimiters = [...KeyCodes.enter, KeyCodes.comma]


  function handleAcceptedFiles(files) {
    setHotelImage({ image: files[0] })
    files.map(image => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        if (image.type == 'application/pdf' || image.type == 'image/png' || image.type == 'image/jpeg') {
          let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          let today = new Date();
          setUserFile({ name: image.name, url: reader.result, date: today.toLocaleDateString("en-US", options) })
        }
      };
      Object.assign(image, {
        preview: URL.createObjectURL(image),
      })
    })
    setSelectedFiles(files)
  }

  const updateField = e => {
      setHotel({
        ...hotel,
        [e.target.name]: e.target.value
      });
      console.log(e.target.name, e.target.value)
  };

  const updateRoomField = e => {
    setRoom({
        ...room,
        [e.target.name]: e.target.value
      });
  };
  

  const insertHotel = () => {
    // setloadingStatus(true)
    let obj = {
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      rooms: rooms,
      image: hotelImage.image,
      _id: hotelId
    }
    addHotel(obj).then((r) => {
      console.log(r)
      history.push('/hotels')

    })
  }

  const reset = () => {
    history.go(0)
  }

  const addRoom = () => {
    setRooms(rooms => [...rooms, room]);
    setRoom({people: 1})
    forceUpdate()
  }
  console.log(rooms)

  const updateHotel = () => {
    // setloadingStatus(true) 
    let obj = {
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      rooms: rooms,
      image: hotelImage.image,
      _id: hotelId
    }
    if(hotelImage.image) {
      obj.image = hotelImage.image
    }
    console.log(hotelImage)
    saveHotel(obj).then((r) => {
      history.push('/hotels')

    })
  }

  const logout = () => {
    localStorage.clear();
  }

  const hotelDelete = (id) => {
    setloadingStatus(true)
    removeHotel(id).then((r) => {
      history.push('/hotels')
    })
  }

  const removeRoom = (index) => {
    let roomsList = rooms;
    roomsList.splice(index, 1);
    setRooms(roomsList);
    forceUpdate()
  }

  return (
    <div className="App">
      <header className="header_new py-2 position-relative">
        <nav
          className="navbar navbar-light navbar-expand-md bg-faded justify-content-center"
        >
          <div className="container d-flex mobile-grid gap-2">
            <a href="/" className="navbar-brand text-center"
            >
              <h1>RN Travel</h1></a
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
                  <a className="nav-link" href="./hotels">All Hotels</a>
                </li>
              </ul>
            </div>
            <div className="header-chat-btn d-none d-md-block">
              <a href="" onClick={() => logout()} title="">Log Out</a>
            </div>
          </div>
        </nav>
      </header>
      <div className="container">
        <div className="jumbotron tagsContainer">
          <h4 className="">Nom de l'Hotel</h4>
          <input type="text" id="email" className="form-control" name="name" placeholder="Nom de l'Hotel" value={hotel.name || ""} onChange={updateField} />
        </div>
        <div className="jumbotron tagsContainer">
          <h4 className="">Emplacement</h4>
          <select className="form-control" onChange={updateField} name="location" value={hotel.location}>
            <option value="Ariana">Ariana</option>
            <option value="Ben Arous">Ben Arous</option>
            <option value="Bizerte">Bizerte</option>
            <option value="Béja">Béja</option>
            <option value="Gabès">Gabès</option>
            <option value="Gafsa">Gafsa</option>
            <option value="Jendouba">Jendouba</option>
            <option value="Kairouan">Kairouan</option>
            <option value="Kasserine">Kasserine</option>
            <option value="Kébili">Kébili</option>
            <option value="La Manouba">La Manouba</option>
            <option value="Le Kef">Le Kef</option>
            <option value="Mahdia">Mahdia</option>
            <option value="Monastir">Monastir</option>
            <option value="Médenine">Médenine</option>
            <option value="Nabeul">Nabeul</option>
            <option value="Sfax">Sfax</option>
            <option value="Sidi Bouzid">Sidi Bouzid</option>
            <option value="Siliana">Siliana</option>
            <option value="Sousse">Sousse</option>
            <option value="Tataouine">Tataouine</option>
            <option value="Tozeur">Tozeur</option>
            <option value="Tunis">Tunis</option>
            <option value="Zaghouan">Zaghouan</option>
          </select>
        </div>
        <div className="jumbotron tagsContainer">
          <h4 className="">La description</h4>
          <textarea name="description" className="form-control" value={hotel.description || ""} onChange={updateField} rows="4"> </textarea>
        </div>
        <div className="jumbotron tagsContainer">
          <h4 className="">Chambres</h4>
          <div>
            <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">Nombre de personnes</th>
                <th scope="col">Prix</th>
                <th className="float-right" >Insérer</th>
              </tr>
            </thead>
            <tbody>
              {rooms && rooms.length > 0 && rooms.map((s_room, index) => {
                return <tr key={"roomN"+index} className="table-info">
                <td scope="row">{s_room.name}</td>
                <td scope="row">{s_room.people}</td>
                <td scope="row">{s_room.price}dt</td>
                <td scope="row"><button className="btn btn-danger" onClick={() => removeRoom(index)}><i className="fa-solid fa-circle-minus"></i></button></td>
              </tr>
              }) }
              <tr>
                <th scope="row"><input className="form-control" onChange={updateRoomField} name="name" value={room.name || ""} placeholder='Name of Room'/></th>
                <td>
                  <select className='form-control' onChange={updateRoomField} name="people" value={room.people || ""}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </td>
                <td><input className="form-control" placeholder='Room price' onChange={updateRoomField} name="price" value={room.price || ""}/></td>
                <td className="float-right"><button className="btn btn-success" onClick={() => addRoom()}>Add Room</button></td>
              </tr>
            </tbody>
            </table>
          </div>
        </div>
        <div className="jumbotron tagsContainer">
          <h4 className="">Hotel Image</h4>
          <Form>
            <Dropzone
              onDrop={acceptedFiles => {
                handleAcceptedFiles(acceptedFiles)
              }}
              multiple={false}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone dz-clickable">
                  <div
                    className="dz-message needsclick"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <div className="mb-3">
                      <i className="display-4 text-muted mdi mdi-upload-network-outline"></i>
                    </div>
                    <h4>Déposez les fichiers ici ou cliquez pour télécharger.</h4>
                  </div>
                </div>
              )}
            </Dropzone>
            <div className="dropzone-previews mt-3" id="file-previews">
              {selectedFiles.length>0 && selectedFiles.map((f, i) => {
                return (
                  <Card
                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                    key={i + "-file"}
                  >
                    <div className="p-2">
                      <Row className="align-items-center">
                        <Col className="col-auto coverContainer">
                          <img
                            data-dz-thumbnail=""
                            height="auto"
                            className="avatar-sm rounded bg-light"
                            alt={f.name}
                            src={f.preview}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Card>
                )
              })
              ||
              <Card
                    className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                   
                  >
                    <div className="p-2">
                      <Row className="align-items-center">
                        <Col className="col-auto coverContainer">
                          <img
                            data-dz-thumbnail=""
                            height="auto"
                            className="avatar-sm rounded bg-light"
                            alt={hotel.name}
                            src={hotel.image}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Card>
              }
            </div>
          </Form>
        </div>
        <div
          className="hotel__buttons-wrapper my-5 d-flex flex-wrap align-items-center justify-content-center gap-3"
        >
          {hotelId && <button className="delete-button" onClick={handleShow}>
            Delete
          </button>}

          {loadingStatus && <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div> || !hotelId && <button type="button" className="publish-button" onClick={() => insertHotel()}>
            Ajouter le hôtel
          </button> || <button type="button" className="publish-button" onClick={() => updateHotel()} >
            Mettre à jour l'hôtel
            </button>}

        </div>

      </div>

      <footer className="footer-main footer shadow-lg">
        <a href="#" title="" className="bottom-to-top-btn"
        ><i className="fas fa-chevron-up"></i><span>TOP</span></a
        >
        <div
          className="container d-flex justify-content-between align-items-center flex-column flex-xl-row"
        >
          <div>
            <h1>RN Travel</h1>
          </div>
          <div>
            <p>Developed by <a className="text-blue" href="https://www.quantadevs.com">QuantaDevs</a></p>
          </div>
        </div>
      </footer>


      <Modal show={show} onHide={handleClose}>
        <ModalBody>Are you sure you want to delete this hotel ?</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={show} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>Delete Hotel ? </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this Hotel ?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => hotelDelete(hotelId)}>Delete</Button>{' '}
          <Button color="secondary" onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </Modal>

    </div>

  )
}



export default Home;