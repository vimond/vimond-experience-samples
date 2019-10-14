import React, { Component }  from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import cx from "classnames/bind";
import PageNotFound from './components/404';
import './app.css';
import { getMenus, getRoutes } from './RouteBuilder';
import Icon from './components/utils/icons/Icons';



const routes = getRoutes();
const menus = getMenus(routes);


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    

  }

  

  onMouseWheel = e => e.preventDefault();

  onTogglePageMenu = () => this.setState({ pageMenuOpen: !this.state.pageMenuOpen });
 
 

  render() {
    const currentRoute = routes.find(route => route.path === window.location.pathname);
    
    return (
      
      <div className={cx('app', { 'page-menu-open': this.state.pageMenuOpen,  config: currentRoute && currentRoute.CONFIG_PAGE})}>

        <header className="page-header">
          <button onClick={this.onTogglePageMenu}><Icon name='menu'/></button>
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
         
         
        </header>

       
        
        <Switch>
          {routes.map(route => <Route
            key={route.key}
            path={route.path}
            render={(props) => ( React.createElement(route.component, {...props })) }
            exact/>)}
          <Route component={PageNotFound}/>
         
        </Switch>

        <div className="page-menu-glasspane" onClick={this.onTogglePageMenu} onWheel={this.onMouseWheel}/>

        <nav className="page-menu">
          <ul>
            {menus.map(route => (
              <li key={route.key}>
                <Link className={cx({ selected: route === currentRoute })} to={route.path} onClick={this.onTogglePageMenu}> {route.title} </Link>
              </li>
            ))}
          </ul>     

        </nav>

        
     
        
      </div>
    );
  }
}
