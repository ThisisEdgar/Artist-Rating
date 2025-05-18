import React from 'react';
import { FaStar } from "react-icons/fa6";
const Star = ({selected=false,onSelect=f=>f}) => {
    return ( <FaStar color= {selected ? "gold": "grey" }
    onClick = {onSelect}
    style={{fontSize:"150%"}}
    /> );
}
export default Star;