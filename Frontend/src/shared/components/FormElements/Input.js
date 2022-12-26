import React from "react";
import './Input.css';
import { useReducer, useEffect } from "react";
import {validate} from '../../util/validators';

const reducer = (state,action) =>{
    switch(action.type){
        case 'CHANGE':
            return (
            {
                ...state, 
                value: action.val,
                isValid: validate(action.val,action.validators)
            })
        case 'BLUR':
            return(
                {
                    ...state,
                    isTouched : true
                }
            )
        default : return state;
    }
}

const Input = props => {

    const [inputState,dispatch] = useReducer(reducer, {
        isValid: props.valid||false, 
        value:props.value || '', 
        isTouched:false
    });

    const changeHandler = event => {
        dispatch({type:'CHANGE',  val : event.target.value, validators : props.validators});
    }

    const blurHandler = () => {
        dispatch({type:'BLUR'});
    }

    const {id,onInput} = props;
    const {value,isValid} = inputState;

    useEffect(()=>{
        onInput(id,value,isValid);
    },[id,value,isValid,onInput]);
    const element = props.element === 'input' ? (
    <input 
        id = {props.id} 
        type = {props.type} 
        placeholder = {props.placeholder} 
        value = {inputState.value} 
        onChange = {changeHandler}
        onBlur = {blurHandler}    
        />)
    : 
    <textarea 
        id = {props.id} 
        rows = {props.rows || 3} 
        value = {inputState.value} 
        onChange = {changeHandler}
        onBlur = {blurHandler} 
        />
    
    return (
        <div className = {`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    )

}

export default Input;