import React from "react";
import "./PlaceList.css";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
const PlaceList = props => {
    if (props.items.length ===0){
        return (
            <div>
                <Card>
                    <h2>Please Add some Places</h2>
                    <Button to = "/places/new">Share Place</Button>
                </Card>
            </div>
        )
    }
    return (
        <ul className = "place-list">
            {props.items.map(place => (
                <PlaceItem 
                    key = {place.id}
                    id = {place.id}
                    image = {place.image}
                    title = {place.title}
                    description = {place.description}
                    address = {place.address}
                    creatorId = {place.creatorId}
                    coordinates = {place.coordinates}
                    onDelete = {props.onDeleteFunc}
                />
            ))}
        </ul>
    )
}

export default PlaceList;