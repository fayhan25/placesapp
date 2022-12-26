import React from "react";
import PlaceList from "../Components/PlaceList";
import { useParams,useHistory } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {useHttpClient} from '../../shared/components/hooks/http-hook';
import { useState, useEffect } from "react";

const UserPlaces = () => {
    const [idPlaces, setIdPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;
    useEffect(()=> {
        const fetchPlaces = async () => {
          try{
          const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
          setIdPlaces(responseData.places);
          }
          catch (err){}
        }
        fetchPlaces();
      }, [sendRequest,userId]);

    const deleteFunc = deletedId =>{
      setIdPlaces(idPlaces.filter(prevPlaces => prevPlaces.filter(place => place.id !== deletedId)));
    }

    return <React.Fragment>
    <ErrorModal error={error} onClear = {clearError}/>
    {isLoading && (<div className="center"><LoadingSpinner/></div>)}
    {!isLoading && idPlaces && (<PlaceList items = {idPlaces} onDeleteFunc = {deleteFunc}/>)}
    </React.Fragment>
}

export default UserPlaces;