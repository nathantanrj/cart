import React from "react"

export default function Cart(props) {
    return (
        <div>
            <p>{props.name} ${props.price} {props.qty}
                <span onClick={props.add} className="cursor-pointer cart-sign"> +</span>
                <span onClick={props.subtract} className="cursor-pointer cart-sign"> -</span>
            </p>            
        </div>
    )
}