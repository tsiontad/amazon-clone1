import React from 'react'
import LayOut from '../../LayOut/LayOut';
import Carousel from '../../Carousel/Carousel';
import Category from '../../Category/Category';
import Product from '../../Product/Product';
import Auth from "../Auth/Auth";
function Landing() {
  return (
    <LayOut>
      <Carousel />
      <Category />
      <Product />
      <Auth/>
    </LayOut>
  );
}

export default Landing