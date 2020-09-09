import React from 'react';
import style from './player.module.css';

const Player = ({name,accomplishments,picture}) => {
    return(
        <div className={style.player}>
            <h1>{name}</h1>
            <img className={style.image} src={picture} alt=""/>
            <ul>
                {accomplishments.map(accomplishment => (
                    <li>{accomplishment}</li>
                ))}
            </ul>
        </div>
    );
}

export default Player;