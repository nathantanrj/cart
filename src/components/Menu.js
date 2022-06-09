import React from "react"

export default function Menu(props) {
    return (
            <div className="item">
                <div><img src={`../images/${props.img}`} className="item--img" alt=""/></div>
                <h3 className="item--name">{props.name}
                  <span className="cursor-pointer" onClick={props.toggle} >&#128722;</span>
                </h3>
                <p className="item--price">Price: ${props.price.toFixed(2)}</p>
            </div>
        )
}

