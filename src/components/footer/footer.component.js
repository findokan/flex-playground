import DiamondIcon from "@mui/icons-material/Diamond";

const Footer = (props) => {
	return (
		<div className="footer-container order-side-by-side">
			<div className="footer-brand">
				<span>
					<DiamondIcon />
				</span>
				<span className="footer-brand-text">Project: Learn Flex</span>
			</div>
			<a
				href="https://github.com/findokan/flex-playground"
				target="_blank"
				rel="noopener"
			>
				GitHub
			</a>
		</div>
	);
};

export default Footer;
