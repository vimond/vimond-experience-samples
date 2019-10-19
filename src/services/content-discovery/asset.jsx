import React, { Component } from 'react';
import ContentDiscoveryAPI from '../../client-api/content-discovery-api';
import Strip from '../../components/ui/Strip';
import Modal from '../../components/utils/modal/modal';
import InlinePlay from '../../components/ui/InlinePlay'



const contentDiscoveryAPI = new ContentDiscoveryAPI();
const ASSET_CATEGORYROOT = process.env.REACT_APP_CD_API_SAMPLE_ASSET_CATEGORYROOT;


class Asset extends Component {
  static CONFIG_PAGE = false;
  static NO_MENU = false;
  static TITLE = "Asset Sample";

  constructor(props) {
    super(props);
    this.state = {
      items:[]
    };
  }

/** load the content */
  componentDidMount() {

    contentDiscoveryAPI.getAssetsFromCategoryId(ASSET_CATEGORYROOT)
    .then(response => { 
        console.log('assetsFromCategoryId',response) 
        this.setState({items:response.data})
      } )

  }

  onCoverClick = (e, item) => {
  
    /* There is no need to make a second request to get the single asset object, since you already have the object from
    * the multiple asset request.
    * Hint, see the onClick function in the Strip component, on how the asset Item is passed on. 
    * To save cost and load on the backend, always try to re-use the data you have available.  */
     this.setState({ asset: item,showModal: true }); 
    

    // But.. if you for some reason need to make the request, her's how to do it. just uncommet the code below
     /*
     contentDiscoveryAPI.getSingleAsset(item.id)
     .then(response => { console.log('Unesessary Single asset request',response.data[0]); this.setState({ asset: response.data[0],showSingle: false }); } )
    */
  };

  closeModalHandler = () => {this.setState({showModal: false});}

  render() {
    
    const { items=[],asset={},showModal, showSingle } = this.state;
    return (
      <div className="page page-padding">
            
            {showSingle /* && <div className='single'><InlinePlay title="Single asset sample" key={asset.id} item={asset} id={asset.id}/> </div> */}
            <Strip listId={ASSET_CATEGORYROOT} title={'Mutiple Assets request-sample from category : ' + ASSET_CATEGORYROOT} items={items} onClick={this.onCoverClick}/>
            
            { showModal && <Modal className="modalV"show={showModal} close={this.closeModalHandler} > 
              <InlinePlay title="Single asset sample" key={asset.id} item={asset} id={asset.id}/> 
            </Modal> }            
     </div>
 
      
    );

  }
}

export default Asset;
