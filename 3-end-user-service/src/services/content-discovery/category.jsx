import React, { Component } from 'react';
import ContentDiscoveryAPI from '../../client-api/content-discovery-api'
import Strip from '../../components/ui/Strip';
import Modal from '../../components/utils/modal/modal';
import InlineCategory from '../../components/ui/InlineCategory';



const contentDiscoveryAPI = new ContentDiscoveryAPI();
const CATEGORYROOT = process.env.REACT_APP_CD_API_SAMPLE_CATEGORYROOT;

class Category extends Component {
  static CONFIG_PAGE = false;
  static NO_MENU = false;
  static TITLE = "Category Sample";

  constructor(props) {
    super(props);
    this.state = {
      items:[]
    };
  }

/** load the content */
  componentDidMount() {
// Using the depth param to get potential subcategories. 
    contentDiscoveryAPI.getSubCategories(CATEGORYROOT,'&depth=1')
    .then(response => { 
        console.log('Calling getSubcategories with children',response) 
        this.setState({items:response.data})
      } )

  }

  onCoverClick = (e, item) => {
  
    /* There is no need to make a second request to get the single category object, since you already have the object from
    * the multiple category request.
    * Hint, see the onClick function in the Strip component, on how the category Item is passed on. 
    * To save cost and load on the backend, always try to re-use the data you have available.  */
     this.setState({ categoryItem: item,showModal: true }); 

    console.log('Category with Children ',item)

    // But.. if you for some reason need to make the request, her's how to do it. just uncommet the code below
    /* 
     contentDiscoveryAPI.getSingleCategory(item.id,'?depth=1')
     .then(response => { console.log('Unesessary Single category request',response.data[0]); this.setState({ category: response.data[0],showSingle: true }); } )
    */
  };

  closeModalHandler = () => {this.setState({showModal: false});}

  render() {
    
    const { items=[],categoryItem={},showModal, showSingle } = this.state;
    return (
      <div className="page page-padding">
            
            {showSingle /* && <div className='single'> </div> */}
            <Strip listId={CATEGORYROOT} title={'Mutiple Category request-sample from  parent category : ' + CATEGORYROOT} items={items} onClick={this.onCoverClick}/>
            
            { showModal && <Modal className="modalV"show={showModal} close={this.closeModalHandler} > 
            <InlineCategory categoryItem={categoryItem}/>
            </Modal> }            
     </div>
 
      
    );

  }
}

export default Category;
