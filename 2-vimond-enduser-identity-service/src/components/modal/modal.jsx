import React from 'react';

import './modal.css';

const modal = (props) => {
    return (
        <div className={props.className}>
             <div className="modal-overlay" onClick={props.close} />
           
                
                <div className="modal-body">
                <div className='close'>
                        <span className="close-modal-btn" onClick={props.close}>×</span>
                    </div>
                   
                    {props.children}
                   
                </div>
              
            </div>
        
    )
}

export default modal;
