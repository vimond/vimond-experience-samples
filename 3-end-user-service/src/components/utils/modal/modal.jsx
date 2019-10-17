import React from 'react';

import './modal.css';

const modal = (props) => {
    return (
        <div className={props.className}>
             <div className="modalV-overlay" onClick={props.close} />
                <div className="modalV-body">
                <div className='closeV'>
                    <span className="close-modalV-btn" onClick={props.close}>×</span>
                </div>
                {props.children}
            </div>
        </div>  
    )
}

export default modal;
