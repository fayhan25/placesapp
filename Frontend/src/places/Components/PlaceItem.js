import React from "react";
import { useState ,useContext} from "react";
import { useParams,useHistory } from 'react-router-dom';
import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './PlaceItem.css';
import Button from '../../shared/components/FormElements/Button.js';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {useHttpClient} from '../../shared/components/hooks/http-hook';




const PlaceItem = props => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const {isLoading,error,sendRequest,clearError}= useHttpClient();
    const [modalState, openCloseModal] = useState(false);
    const [deleteState, openDeleteState] = useState(false);
    const openModal = () => openCloseModal(true);
    const closeModal = () => openCloseModal(false);

    const openDeleteModal = () => openDeleteState(true);
    const closeDeleteModal = () => openDeleteState(false);
    const confirmDeleteModal = async () => {
        openDeleteState(false);
        try {
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`, 
            'DELETE',
            null,
            {
                Authorization : 'Bearer ' + auth.token
            }
            
            );
            props.onDelete(props.id);
        }
        catch(err){}
        
    }
    return (
        <React.Fragment>
        <ErrorModal error ={error} onClear = {clearError}/>
            <Modal 
            show = {modalState} 
            onCancel = {closeModal} 
            header = {props.address}
            contentClass = 'place-item__model-content' 
            footerClass =  'place-item__model-actions'
            footer = {<Button onClick = {closeModal}>Close</Button>}
            >
                <div className="map-container">
                    <Map center = {props.coordinates} zoom = {16}/>
                </div>
            </Modal>

            <Modal
                show = {deleteState}
                onCancel = {closeDeleteModal}
                footerClass =  'place-item__model-actions'
                header = "Are you sure you want to Delete ?"
                footer = {
                    <React.Fragment>
                        <Button danger onClick = {closeDeleteModal}>Cancel</Button>
                        <Button danger onClick = {confirmDeleteModal}>Delete</Button>
                    </React.Fragment>
                
                }
            >
                <p> Are you sure you want to delete this action can not be undone</p>
            </Modal>

            <li className="place-item">     
                    
                    <Card className="place-item__content">   
                    {isLoading && <LoadingSpinner asOverlay/>}           
                        <div className="place-item__image">
                            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt = {props.title}/>
                        </div>

                        <div className="place-item__info">
                            <h1>{props.title}</h1>
                            <h2>{props.address}</h2>
                            <h3>{props.description}</h3>
                        </div>
                        <div className="place-item__actions">
                            <Button inverse onClick = {openModal}>View On Map</Button>
                            {auth.userId === props.creatorId && <Button to = {`/places/${props.id}`}>Edit</Button>}
                            {auth.userId === props.creatorId && <Button danger onClick = {openDeleteModal}>Delete</Button>}
                        </div>
                    </Card>
                
            </li>
        </React.Fragment>
        )
}

export default PlaceItem;