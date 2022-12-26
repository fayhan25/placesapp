
import {useReducer,useCallback} from "react";


const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE':
        let formIsValid = true;
        for (const inputId in state.inputs) {
          if (!state.inputs[inputId]){
            continue;
          }
          if (inputId === action.inputId) {
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        console.log(state);
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: { value: action.value, isValid: action.isValid }
          },
          isValid: formIsValid
        };
      case 'SET_FORM':
        return {
          inputs: action.inputs,
          isValid:action.formIsValid
        }
      default:
        return state;
    }
  };


export const useForm = (initialInputs,initialValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialValidity
      });

    const inputHandler = useCallback((id,value,isValid) => {
      dispatch({
        type:'INPUT_CHANGE',
        isValid:isValid,
        inputId:id,
        value:value})
      },[]);
      
      const setFormData = useCallback((changedInputs,changedValidity) =>{
        dispatch({
          type: 'SET_FORM',
          inputs:changedInputs,
          formIsValid:changedValidity
        });
      },[]);
      console.log();
      return [formState,inputHandler,setFormData];
};