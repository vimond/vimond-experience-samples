import React  from 'react';

export default ({ alt, item, onClick, onMouseOver, src, location, ...props }) => {
  let id;
  if(item){
    if (item.images) {
        src = item.imageUrl || (item.images && item.images.defaultUrl);
    } else if(item.content){
      src = item.content.images.defaultUrl;
      if(location){
        src=src+'?location='+location
      }
    } else {
      src='';
    }
    id = item.id;
    alt = item.title;
  }

  return (
    <img className="cover" {...props} src={src} alt={alt} onMouseOver={onMouseOver} onClick={onClick} data-id={id}/>
  );
}
