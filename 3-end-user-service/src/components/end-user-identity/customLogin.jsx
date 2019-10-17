import React from 'react';
import Icon  from '../utils/icons/Icons'
import {useAuth0} from '../../client-api/end-user-identity'
import InputGroup from '../utils/input/inputgroup'
import Tabs from '../utils/tabs/tabs'

 const CustomLogin = ({onClose}) => {
  const { customLoginSDK,respondMessage,resetPasswordSDK,signUpSDK } = useAuth0();
  
  let options = {
      username:"",
      password:"",
      email:"",   
    };     

  const login = id =>{   
    customLoginSDK(options).then(
      result => {console.log('sucessful login')}, // doesn't run
      error => {
        console.log(error) 
        
      }
    );
  }

  const signup = id =>{   
    signUpSDK(options).then(
      result => {console.log('sucessful login')}, // doesn't run
      error => {
        console.log(error) 
        
      }
    );
  }


  const resetPassword = id =>{   
    resetPasswordSDK(options).then(
      result => {console.log('sucessful login', result)}, // doesn't run
      error => {
        console.log(error) 
        
      }
    );
  }

  
  const onChange = (e) => {
      let value = e.target.value;
      let valueKey = e.target.dataset.id;
      options[valueKey] = value;
      console.log(options)
    };
    
  
    return (  
      <>
        <div className="customlogin-form">
        <div className="customlogin-form-overlay"/>
          <div className="customlogin-content">
          <Icon name="vimond" className="logo customlogin-icon-vimond"/>
          <Tabs>
            <div label="Login"> 
              <InputGroup>     
                  <input key='username' id='username' placeholder='username' onChange={onChange}/>  
                  <input key='password' id='password' placeholder='password' type='password'  onChange={onChange}/>  
                  <h1>{respondMessage }</h1>   
                  <button onClick={login}>Login</button>                
              </InputGroup>
            </div>
            <div label="signup">
            <InputGroup>
                  <input key='email' id='email' placeholder='email' onChange={onChange}/>  
                  <input key='password' id='password' placeholder='password' type='password'  onChange={onChange}/> 
                  <h1>{respondMessage }</h1>   
                  <button onClick={signup}>Signup</button>                             
              </InputGroup>
            </div>  
            <div label="forgot password">
              <InputGroup>
                <input key='email' id='email' placeholder='email' onChange={onChange}/>  
                <button onClick={resetPassword}>Reset</button>
                <h1>{respondMessage }</h1>  
              </InputGroup>
            </div>  
          </Tabs>
           
          </div>
          <div className="customlogin-action">

          </div>

        </div>
        
      </>
    );
  }

  export default CustomLogin;


