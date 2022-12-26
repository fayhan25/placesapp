import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import './NewPlace.css';
import { VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/components/hooks/form-hook';
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {useHttpClient} from '../../shared/components/hooks/http-hook';
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const {isLoading,error,sendRequest,clearError}= useHttpClient();
  const [formState,inputHandler] = useForm( {
        title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
      
    },
    false
  );

  const history = useHistory();

  const onSubmitHandler = async event => {
    event.preventDefault();
    try{
      const formData = new FormData();
      formData.append('title',formState.inputs.title.value );
      formData.append('description',formState.inputs.description.value );
      formData.append('address',formState.inputs.address.value );
      formData.append('creatorId', auth.userId)
      formData.append('image',formState.inputs.image.value );
      await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places', 'POST',formData, {Authorization: 'Bearer ' + auth.token});
      history.push('/');
    }
    catch(err){}
  }
  
  return <React.Fragment>
    <ErrorModal error = {error} onClear = {clearError}/>
    {isLoading && <LoadingSpinner/>}
    <form className='place-form' onSubmit={onSubmitHandler}>
      <Input 
        id = "title"
        element = 'input' 
        type='text' 
        label = 'Title: ' 
        validators = {[VALIDATOR_REQUIRE()]} 
        errorText = 'Please type something'
        onInput = {inputHandler}
      />

      <ImageUpload id = 'image' center onInput = {inputHandler} />

      <Input 
        id = "description"
        element = 'textarea' 
        label = 'Description: ' 
        validators = {[VALIDATOR_MINLENGTH(5)]} 
        errorText = 'Please type something at least 5 characters'
        onInput = {inputHandler}
      />

      <Input 
        id = "address"
        element = 'input' 
        label = 'Address: ' 
        validators = {[VALIDATOR_REQUIRE()]} 
        errorText = 'Please type an address'
        onInput = {inputHandler}
      />

      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>      
    </form>
  </React.Fragment>
};

export default NewPlace;