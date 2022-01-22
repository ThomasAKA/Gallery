import React,{useEffect, useState} from 'react';
import { Button, Modal, ModalBody,ModalFooter ,Spinner} from 'reactstrap';
import axios from 'axios';

/**
* @author
* @function Upload
**/
    const Upload = (props) => {
    
    const [files,setFiles] = useState(null)
    const [preView,setPreview] = useState(null)
    const [loading,setLoading]  = useState(false)
    const {
        showModal,
        setOpen
    } = props;

    const handleChange = (event) => {
  
        const fileUrls = [...event.target.files].map((file) => {
             return  URL.createObjectURL(file)
         })
         setPreview(fileUrls)
         setFiles(event.target.files)
        //  console.log(preView)
         return () => {
        //    event.target.file.map((url) => )
             URL.revokeObjectURL(event.target.file)
          
         }
      }

      const savePhoto = (event) => {
          const formDataBody = new FormData();
          formDataBody.append('file', files[0]); 
          setLoading(true)
          axios({
            method: "post",
            url: "http://localhost:3005/photos",
            data: formDataBody,
            headers: { "Content-Type": "multipart/form-data" },
          })
            .then(function (response) {
              //handle success
               if(response.data.status === 200){
                setOpen(false);
                setPreview(null);
                setFiles(null)
                // alert('photo uploaded')
                window.location.reload(false);
               }else {
                alert('Uploading Failed')
               }
            })
            .catch(function (response) {
              //handle error
              alert('Uploading Failed')
              console.log(response);
            });
      }
 

    return(
        <Modal isOpen={showModal} toggle={() => {setOpen(false);setPreview(null);}}>
        <ModalBody>
        <div>
          <form onSubmit={(e) => { e.preventDefault()}}>
            <input 
              type="file" 
              name="file" 
              onChange={handleChange}
              />
          </form>

          {/* Display all selected images. */} 
            {preView ? <div>
               <img src={preView} alt="imgs" width={300} />
               {/* <button onClick={(event) => handleDelete(event,index)}>Delete</button> */}
            </div> : ""}
         </div>
        </ModalBody>
        <ModalFooter>
            <Button onClick={savePhoto}>{loading?
              <Spinner
              color="secondary"
              type="grow"
            >
              Loading...
            </Spinner>
            :'Upload'}</Button>
        </ModalFooter>
    </Modal>
   )

 }

 export default Upload