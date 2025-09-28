import Header from "../Header/Header";
import LowerHeader from "../Header/LowerHeader"


function Layout(props) {
  return (
    <>
      <Header />
      <LowerHeader />
      {props.children}
    </>
  );
}
export default Layout