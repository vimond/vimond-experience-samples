import React, { useState } from "react";
import { Link, Route, Switch } from 'react-router-dom';
import cx from "classnames/bind";
import PageNotFound from './components/404';
import Profile from './components/end-user-identity/Profile';
import './app.css';
import { getMenus, getRoutes } from './RouteBuilder';
import Icon from './components/utils/icons/Icons';
import ProfileBar from "./components/end-user-identity/ProfileBar";
import Modal from './components/utils/modal/modal';
import AuthProfile from './components/end-user-identity/Profile';
import CustomLogin from './components/end-user-identity/customLogin'
import SubProfiles from './components/sub-profile/SubProfiles'




const routes = getRoutes();
const menus = getMenus(routes);


 const App = () => {


  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileModalOpen, SetProfileModalOpen] = useState(false);
  const [customLoginModalOpen, setCustomLoginModalOpen] = useState(false);
  const [subProfileOpen, setSubProfileOpen] = useState(false);

 const onMouseWheel = e => e.preventDefault();

 const onTogglePageMenu = () => setPageMenuOpen(!pageMenuOpen);
 const onToggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
 const onToggleProfileModal = () => SetProfileModalOpen(!profileModalOpen);
 const onToggleCustomLoginModal = () => setCustomLoginModalOpen(!customLoginModalOpen);
 const onToggleSubProfileModal = () => setSubProfileOpen (!subProfileOpen );


  const currentRoute = routes.find(route => route.path === window.location.pathname);
  

  
   

    return (
      
      <div className={cx('app', { 'page-menu-open':pageMenuOpen, 'profile-menu-open': profileMenuOpen, config: currentRoute && currentRoute.CONFIG_PAGE})}>

        <header className="page-header">
          <button onClick={onTogglePageMenu}><Icon name='menu'/></button>
         
          <a href="/" className="home">
            <Icon name='vimond' className=''/>
          </a>

          <a href="https://vimond-experience-api.readme.io/"  target="_blank" rel="noopener noreferrer"  className="lab">
            <h1>API docs</h1>
          </a>
          <a href="https://vcc-user-manual.readme.io/" target="_blank" rel="noopener noreferrer"  className="lab">
            <h1>VCC docs</h1>
          </a>
          <a href="https://vimond.github.io/replay/"  target="_blank" rel="noopener noreferrer"  className="lab">
            <h1>Replay</h1>
          </a>
          <div className="tmdb-logo" >
              <img alt='The Movie Database' src='/tmdb-stacked.png'/> 
          </div>
          
        </header>

       
        
        <Switch>
          {routes.map(route => <Route
            key={route.key}
            path={route.path}
            render={(props) => ( React.createElement(route.component, {...props })) }
            exact/>)}
          <Route component={PageNotFound}/>
          <Route path="/profile" component={Profile} />
        </Switch>

        <div className="page-menu-glasspane" onClick={onTogglePageMenu} onWheel={onMouseWheel}/>

        <nav className="page-menu">
          <ul>
            {menus.map(route => (
              <li key={route.key}>
                <Link className={cx({ selected: route === currentRoute })} to={route.path} onClick={onTogglePageMenu}> {route.title} </Link>
              </li>
            ))}
          </ul>     

        </nav>

        
        <ProfileBar onClick={onToggleProfileMenu} showProfile={onToggleProfileModal} showCustomLogin={onToggleCustomLoginModal} showSubProfile={onToggleSubProfileModal}/>  
        

        {profileModalOpen && 
          <Modal className="modalV"show={profileModalOpen} key='auth' close={onToggleProfileModal} > 
            <AuthProfile/>
          </Modal> }

          {customLoginModalOpen && 
          <Modal className="modalV"show={customLoginModalOpen} key='customLogin' close={onToggleCustomLoginModal} > 
            <CustomLogin/>
          </Modal> }

          {subProfileOpen && 
          <Modal className="modalV"show={subProfileOpen} key='customLogin' close={onToggleSubProfileModal} > 
              
                <SubProfiles onClose={onToggleSubProfileModal}/>
             
          </Modal> }

        
      </div>
    );
  }

  export default App;