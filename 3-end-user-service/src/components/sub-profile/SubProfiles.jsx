

import React, { useState,useEffect } from "react";
import { useEndUserServices } from "../../client-api/end-user-services";
import Icon from '../utils/icons/Icons'
import ContentDiscoveryAPI from '../../client-api/content-discovery-api';



const SubProfiles = ({onClose}) => {
  const { subProfiles,loading,errorMessage,initSubProfile,createSubProfile,deletSubProfile,updateSubProfile } = useEndUserServices();
  const source = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&rounded=true&name=";
  const rootPanel = process.env.REACT_APP_CD_API_CURATION_ROOT_PANEL;
  const contentDiscoveryAPI = new ContentDiscoveryAPI();
  
  // local state
  const [showInput, setShowInput] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [optionValue,setOptionValue] = useState('');
  const [inputValue,setInputValue] = useState('');
  const [subID,setSubID] = useState('');
  const [selectOptions, setSelectOptions] = useState([])
  useEffect(() => {
   
  });
  
  
const editExistingSubprofile = id =>{   

  console.log('we',id.target.dataset.page)
  const subProfile = JSON.parse(id.target.dataset.page)
  loadPageList();
  setOptionValue(subProfile.properties.frontPage);
  setInputValue(subProfile.subProfileName); 
  setSubID(subProfile.subProfileId);
  setAddNew(false)
  setShowInput(true);  
}

const prepNewSubprofile = ()=>{ loadPageList(); setInputValue(''); setShowInput(true); setAddNew(true)}

const update_subProfile = () => {
  const body = {subProfileName: inputValue, 
    properties: {
    frontPage: optionValue
  }};
  updateSubProfile(subID,body)
}

const loadSubProfile = () => { initSubProfile(subID); setTimeout(function () {onClose()}, 500)}
const deleteSubProfile = () => { deletSubProfile(subID); }
const loadPageList = () => { contentDiscoveryAPI.getContentCurationListByID(rootPanel).then(elements =>{ setSelectOptions(elements.data[0].elements)})}

const createNewSubProfile = () => {
  const body = {subProfileName: inputValue, 
    properties: {
    frontPage: optionValue
  }};
  createSubProfile(body);
}

const onChange = (e) => { 
    let value = e.target.value;
    let valueKey = e.target.dataset.id;
    valueKey==='frontPage'?setOptionValue(value):setInputValue(value);
}

  


  return ( 
  <div align="center" className="userPages">
    <div className="subProfileCovers" >
        <div className="subProfileCover" onClick={prepNewSubprofile}>
          <Icon className="subProfileAdd" name="add"/>
          <h1>ADD</h1>
        </div> 
        {(loading || !subProfiles) && <div>Loading profiles...</div> }
        {errorMessage  && <div>{errorMessage}</div> }
        {subProfiles &&  subProfiles.map(subProfile =>
            <div className="subProfileCover" key={subProfile.subProfileId}  >
              <img alt={subProfile.subProfileName} src={source + subProfile.subProfileName } onClick={loadSubProfile}  /> 
              <div onClick={editExistingSubprofile} data-name={subProfile.subProfileName}  data-id={subProfile.subProfileId} > <h1 data-page={JSON.stringify(subProfile)} >{subProfile.subProfileName}</h1> </div>
            </div>  
        )}
    </div>   
      
    {showInput && 
      <div className="subprofile-edit" >
        <div className="input-item">
          <input  value={inputValue} className='input' data-id='subProfileName' onChange={onChange}  /> 
        </div> 
        <div className="input-item">
          <select className='input' data-id='frontPage' value={optionValue} onChange={onChange} >
            {selectOptions.map(option => 
              <option value={option.id} key={option.id}>{option.title}</option>
            )}
          </select>
        </div>
        <div className="input-item">
          {addNew?<button onClick={createNewSubProfile} >Create</button>:
            <div>
              <button onClick={()=>{update_subProfile(); setShowInput(false)}} >Update</button>
              <button onClick={deleteSubProfile} >delete</button>
            
            </div>}
        </div>      
      </div>} 
  </div>
  );
 
};

export default SubProfiles;