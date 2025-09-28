import { Carousel } from "react-responsive-carousel";
import {img} from "./data"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import classes from "./Carousel.module.css";
function CarouselEffect() {
  return (
    <div>
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
      >
        {img.map((imageItemLink) => {
          return <img src={imageItemLink} />;
        })}
      </Carousel>
      <div className={classes.hero_image}></div>
    </div>
  );
}

export default CarouselEffect