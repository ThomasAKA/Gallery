import { Button,ModalBody,ModalFooter,Spinner,Modal } from 'reactstrap'
import React, { useEffect, useState } from 'react'
import Upload from './Upload'
import album from '../photo-gallery.png'
import axios from 'axios'

/**
* @author
* @function 
**/

const Gallery = (props) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])
    const [showModal,setModal] = useState(false)
    const [showModal1,setModal1] = useState(false)
    const [photo,setPhoto] = useState({})

    useEffect(() => {
        setLoading(true)
        axios.get('http://localhost:3005/photos')
        .then(response => {
           const {data} =  response.data;
           console.log(data)
           setData(data)
           setLoading(false)
        }).catch(err => {setLoading(false);setData([])})
    },[])

    const setOpen = (value) => {
        setModal(value)
    }

    const handlePhoto = (id) => {
        const result = data.filter(photo => photo.id === id);
        console.log(result)
        setPhoto(result[0]);
        setModal1(true)

    }
    const handleDelete = (id) => {
        setLoading(true)
        axios({
            method:'DELETE',
            url:`http://localhost:3005/photos/${id}`,
        }).then(response => {
            setModal1(false)
            setLoading(false)
            window.location.reload(false);
        }).catch(err => alert('Unable to delete'))
    }

    const photoModal = (
        <Modal isOpen={showModal1} toggle={() => setModal1(false)}>
            <ModalBody>
                <img src={photo.url} />
            </ModalBody>
            <ModalFooter>
                <Button onClick={() =>handleDelete(photo.id)} className='delete-btn'>{loading? 
                      <Spinner
                      color="secondary"
                      type="grow"
                    >
                      Loading...
                    </Spinner>
                :
                <i className="fa fa-trash"></i>}</Button>
            </ModalFooter>
        </Modal>
    )
    const photos = data.map((photo) => (
        <div className="gallery-photo-container">
            <img src={photo.url} key={photo.id} className="gallery-photo"  onClick={() => handlePhoto(photo.id)} />
        </div>
    ))
    return (
        <div className="gallery-container" >
            {data.length > 0 ?<Button className="upload-btn"  onClick={() => setModal(!showModal)}>Upload</Button> :""}
            <div className="gallery">
                {
                 data.length < 1 && !loading ? <div className="no-image">
                     {/* <h2>My Gallery</h2> */}
                     <div>
                       <img  src={album}  className="logo"/>
                     </div>
                        <Button className='upload-btn' onClick={() => setModal(!showModal)}>Upload</Button>
                     {/* <h2>No Image</h2> */}
                     </div> : photos
                }
            </div>
            <Upload  showModal={showModal} setOpen ={setOpen}/>
            {photoModal}
        </div>
    )
}

export default Gallery