import React, { Component } from 'react';
import ContentDiscoveryAPI from '../../client-api/content-discovery-api'
import Strip from '../../components/ui/Strip';
import Carousel from '../../components/ui/Slider';

import Modal from '../../components/utils/modal/modal';
import InlineCategory from '../../components/ui/InlineCategory';
import InlinePlay from '../../components/ui/InlinePlay'



const contentDiscoveryAPI = new ContentDiscoveryAPI();
const CURATION_ROOT = process.env.REACT_APP_CD_API_FRONT_PAGE;



class Curation extends Component {
  static CONFIG_PAGE = false;
  static NO_MENU = false;
  static TITLE = "Curation list";

  constructor(props) {
    super(props);
    this.state = {
      items:[]
    };
  }

/** load the content */
  componentDidMount() {
// Using the dpth param to get potential subcategories. 
    contentDiscoveryAPI.getContentCurationListByID(CURATION_ROOT)
    .then(response => { 
        console.log('Calling getSubcategories getContentCurationListByID ',response) 
        this.setState({items:response.data[0].elements})
      } )

  }

  onCoverClick = (e, item) => {
  
    if(item.contentType==='asset'){
      this.setState({ item: item,showModal: true }); 
    }else{
      this.showCategory(item);
    }

  };

  showCategory(item) {
    /** In this case we need to load the depth since the children is not a part of the  */
     contentDiscoveryAPI.getSingleCategory(item.id,'?depth=1')
     .then(response => { console.log('Single category request with children',response.data[0]); this.setState({ item: response.data[0],showModal: true }); } )

  }


  closeModalHandler = () => {this.setState({showModal: false});}

  render() {
    
    const { items=[],item={},showModal } = this.state;
    return (
      <>
      <div className="page">
            
           {items.map(item =>{
            if(item.contentType==='contentpanel' && item.container_type==='Resume') {
              return "" /** TODO  This will be implemented in a later sample */
            } else if(item.contentType==='contentpanel' && item.container_type==='Favorites') {
              return "" /** TODO This will be implemented in a later sample */
            } else if(item.contentType==='carousel'){
              return <Carousel key={item.id}  title={item.title} items={item.elements} onClick={this.onCoverClick}/>
            }else if(item.contentType==='contentpanel'){
              return <Strip key={item.id}  title={item.title} items={item.elements} onClick={this.onCoverClick}/>
            }else{
              return <Strip key={item.id}  title={item.title} items={item.elements} onClick={this.onCoverClick}/>
            }
          }
           )}
     
                    
     </div>

    { showModal && <Modal className="modalV"show={showModal} close={this.closeModalHandler} > 
      {item.contentType==='asset'?<InlinePlay item={item.content} /> : <InlineCategory categoryItem={item}/>}
    </Modal> }    
    </>  
    );

  }
}

export default Curation;
