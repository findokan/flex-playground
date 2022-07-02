import NavigationBar from "../navigation.bar/navigation.bar.component";
import Footer from "../footer/footer.component";
import { Outlet } from "react-router-dom";

const Layout = (props) => {
	return (
		<>
			<NavigationBar navigationBarItems={props.navigationBarItems} />
			<Outlet />
			<Footer />
		</>
	);
};

export default Layout;
