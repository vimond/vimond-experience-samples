import React from 'react';



const HOME = 'home';

export const getRoutes = () => {
  // require all *.jsx files in ./pages
  const pages = require.context('./services', true, /.*\.jsx$/);
  const pageNames = pages
    .keys()
    .filter(key => {
      const name = key.match(/.*\/(.*).jsx$/)[1];

      return key === `./${name}.jsx` || key === `./${name}/${name}.jsx` || key === `./content-discovery/${name}.jsx`  ;
    });
  const pageComponents = pageNames.map(pages);
  const routes = pageNames.map((fileName, index) => {
    const title = fileName.match(/.*\/(.*).jsx$/)[1];
    const key = title.toLowerCase();
    const component = React.createElement(pageComponents[index].default);

    return {
      key,
      title: component.type.TITLE || title ,
      path: `/${key !== HOME ? key : ''}${(component.type && component.type.PATH_SUFFIX) || ''}`,
      component: pageComponents[index].default,
      NO_MENU: component.type && component.type.NO_MENU,
      HEADER: component.type && component.type.HEADER,
      CONFIG_PAGE:  component.type && component.type.CONFIG_PAGE,
    }
  });
  const index = routes.findIndex(route => route.key === HOME);

  if (index > -1) {
    const home = routes[index];

    routes.splice(index, 1);
    routes.unshift(home);
  }
  return routes;
};

export const getMenus = routes => routes.filter(route => !route.NO_MENU);

export const getTabs = routes => routes.filter(route => route.HEADER);
