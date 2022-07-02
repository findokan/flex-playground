import React, { useCallback, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { TabPanel, a11yProps } from "./playground.tabpanel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import loadash from "lodash";

const PGMenu = ({ DOM, setDOM, selectedItemId, setSelectedItemId }) => {
	//#region COMPONENT INITILIZATION
	const [tabValue, setTabValue] = useState(0);

	const getSelectedItem = useCallback((tempDOM, selectedItemId) => {
		if (tempDOM.id === selectedItemId) {
			return tempDOM;
		} else {
			for (let elementIndex in tempDOM.children) {
				const selectedItem = getSelectedItem(
					tempDOM.children[elementIndex],
					selectedItemId
				);
				if (selectedItem) return selectedItem;
			}
		}
	}, []);

	const [willEditedItem, setWillEditedItem] = useState(
		getSelectedItem(DOM, selectedItemId)
	);

	useEffect(() => {
		setWillEditedItem(getSelectedItem(DOM, selectedItemId));
	}, [DOM, selectedItemId, getSelectedItem]);
	//#endregion

	//#region FORM HELPERS
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};
	//#endregion

	//#region DOM MANIPULATION HELPERS
	function isRootNode() {
		return DOM.id === selectedItemId ? true : false;
	}

	function getParentItem(tempDOM, selectedItemId) {
		if (
			tempDOM.children.findIndex((child) => child.id === selectedItemId) !== -1
		) {
			return tempDOM;
		} else {
			for (let elementIndex in tempDOM.children) {
				const selectedItem = getParentItem(
					tempDOM.children[elementIndex],
					selectedItemId
				);
				if (selectedItem) return selectedItem;
			}
		}
	}

	function updateStyleAttribute(
		parentTitle,
		attribute,
		value,
		convertToInt = true,
		defaultValue = null
	) {
		if (!isNaN(value) && convertToInt) {
			value = parseInt(value);

			if (isNaN(value)) value = defaultValue;
		}

		let clonedItem = loadash.cloneDeep(willEditedItem);
		clonedItem.styleAttributes[parentTitle][attribute] = value;
		const editedDOM = loadash.cloneDeep(editDOM(DOM, clonedItem));
		setDOM(editedDOM);
	}
	//#endregion

	//#region DOM MANIPULATION
	function editDOM(tempDOM, editedItem) {
		if (tempDOM.id === editedItem.id) {
			return editedItem;
		}
		if (tempDOM.children !== undefined && tempDOM.children.length > 0) {
			for (let i = 0; i < tempDOM.children.length; i++) {
				tempDOM.children[i] = editDOM(tempDOM.children[i], editedItem);
			}
		}
		return tempDOM;
	}

	function addChildNodeToSelectedItem() {
		let selectedItem = loadash.cloneDeep(getSelectedItem(DOM, selectedItemId));
		selectedItem.children.push({
			id: (parseInt(window.lastID) + 1).toString(),
			label: (parseInt(window.lastID) + 1).toString(),
			styleAttributes: {
				flex: {
					direction: "ltr",
					flexDirection: "row",
					basis: "auto",
					grow: 0,
					shrink: 1,
					flexWrap: "no-wrap",
				},
				alignment: {},
				layout: {
					width: 100,
					height: 100,
					maxWidth: null,
					maxHeight: null,
					minWidth: null,
					minHeight: null,
					aspectRatio: "auto",
				},
			},
			children: [],
		});
		window.lastID = (parseInt(window.lastID) + 1).toString();
		const editedDOM = loadash.cloneDeep(editDOM(DOM, selectedItem));
		setDOM(editedDOM);
	}

	function deleteNode() {
		let parentItem = loadash.cloneDeep(getParentItem(DOM, selectedItemId));
		const childIndex = parentItem.children.findIndex(
			(child) => child.id === selectedItemId
		);
		parentItem.children.splice(childIndex, 1);
		const editedDOM = loadash.cloneDeep(editDOM(DOM, parentItem));
		setDOM(editedDOM);
		setSelectedItemId("");
	}
	//#endregion

	//#region RENDER FUNCTIONS
	function renderNoSelectedItem() {
		return (
			<span className="pg-menu-no-data">
				Select a node to edit its properties
			</span>
		);
	}

	function renderSelectedItem() {
		function renderAddRMNodeButtons() {
			return (
				<div className="pg-menu-add-rm-area">
					{/* Add Button Start */}
					<Button
						variant="contained"
						onClick={(e) => {
							e.stopPropagation();
							addChildNodeToSelectedItem();
						}}
					>
						<AddCircleOutlineIcon style={{ fontSize: "16px" }} />
						&nbsp; add child node
					</Button>
					{/* Add Button End */}
					{/* Delete Button Start */}
					<Button
						variant="outlined"
						disabled={isRootNode()}
						onClick={(e) => {
							e.stopPropagation();
							deleteNode();
						}}
					>
						<HighlightOffIcon style={{ fontSize: "16px" }} />
						&nbsp; delete node
					</Button>
					{/* Delete Button End */}
				</div>
			);
		}

		return (
			<>
				<Box
					className="full-width"
					onClick={(e) => {
						e.stopPropagation();
					}}
				>
					{/* Tab Container Start */}
					<Box className="pg-menu-tab-container">
						<Tabs
							className="pg-menu-tab-box"
							value={tabValue}
							onChange={handleTabChange}
						>
							<Tab
								className="pg-menu-tab-item"
								style={{ textTransform: "none" }}
								label="Flex"
								{...a11yProps(0)}
							/>
							<Tab
								style={{ textTransform: "none" }}
								label="Alignment"
								{...a11yProps(1)}
							/>
							<Tab
								style={{ textTransform: "none" }}
								label="Layout"
								{...a11yProps(2)}
							/>
						</Tabs>
					</Box>
					{/* Tab Container End */}
					{/* Flex Tab Start */}
					<TabPanel className="pg-menu-tab-panel" value={tabValue} index={0}>
						{renderFlexArea()}
					</TabPanel>
					{/* Flex Tab End */}
					{/* Alignment Tab Start */}
					<TabPanel className="pg-menu-tab-panel" value={tabValue} index={1}>
						{renderAlignmentArea()}
					</TabPanel>
					{/* Alignment Tab End */}
					{/* Layout Tab Start */}
					<TabPanel className="pg-menu-tab-panel" value={tabValue} index={2}>
						{renderLayoutArea()}
					</TabPanel>
					{/* Layout Tab End */}
				</Box>
				{renderAddRMNodeButtons()}
			</>
		);
	}

	//#region MENU TAB PANEL RENDERS
	function renderFlexArea() {
		return (
			<div className="pg-menu-tab-style">
				{/* Direction Attribute Start */}
				<div>
					<div>DIRECTION</div>
					<div>
						<ToggleButtonGroup
							color="primary"
							value={willEditedItem?.styleAttributes?.flex.direction}
							exclusive
							fullWidth
							onChange={(e) =>
								updateStyleAttribute("flex", "direction", e.target.value)
							}
						>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="inherit"
							>
								inherit
							</ToggleButton>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="ltr"
							>
								ltr
							</ToggleButton>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="rtl"
							>
								rtl
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
				</div>
				{/* Direction Attribute End */}
				{/* Flex Direction Attribute Start */}
				<div className="space-from-top">
					<div>FLEX DIRECTION</div>
					<div>
						<FormControl fullWidth>
							<Select
								size="small"
								value={
									willEditedItem?.styleAttributes.flex.flexDirection || "column"
								}
								onChange={(e) =>
									updateStyleAttribute("flex", "flexDirection", e.target.value)
								}
							>
								<MenuItem value={"column"}>column</MenuItem>
								<MenuItem value={"column-reverse"}>column-reverse</MenuItem>
								<MenuItem value={"row"}>row</MenuItem>
								<MenuItem value={"row-reverse"}>row-reverse</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
				{/* Flex Direction Attribute End */}
				{/* Flex Attribute Start */}
				<div className="space-from-top order-side-by-side">
					{/* Flex Basis Start */}
					<div className="set-center">
						<div>BASIS</div>
						<div>
							<TextField
								size="small"
								disabled={isRootNode()}
								value={
									willEditedItem?.styleAttributes?.flex?.basis === "auto"
										? ""
										: willEditedItem?.styleAttributes?.flex?.basis
								}
								placeholder="auto"
								onChange={(e) =>
									updateStyleAttribute(
										"flex",
										"basis",
										e.target.value,
										true,
										"auto"
									)
								}
							/>
						</div>
					</div>
					{/* Flex Basis End */}
					{/* Flex Grow Start */}
					<div className="set-center give-space-horizontal">
						<div>GROW</div>
						<div>
							<TextField
								size="small"
								disabled={isRootNode()}
								value={
									willEditedItem?.styleAttributes?.flex?.grow === 0
										? ""
										: willEditedItem?.styleAttributes?.flex?.grow
								}
								placeholder="0"
								onChange={(e) =>
									updateStyleAttribute("flex", "grow", e.target.value, true, 0)
								}
							/>
						</div>
					</div>
					{/* Flex Grow End */}
					{/* Flex Shrint Start */}
					<div className="set-center">
						<div>SHRINK</div>
						<div>
							<TextField
								size="small"
								disabled={isRootNode()}
								value={
									willEditedItem?.styleAttributes?.flex?.shrink === 1
										? ""
										: willEditedItem?.styleAttributes?.flex?.shrink
								}
								placeholder="1"
								onChange={(e) =>
									updateStyleAttribute(
										"flex",
										"shrink",
										e.target.value,
										true,
										1
									)
								}
							/>
						</div>
					</div>
					{/* Flex Shrint End */}
				</div>
				{/* Flex Attribute End*/}
				{/* Flex Wrap Start */}
				<div className="space-from-top">
					<div>FLEX WRAP</div>
					<div>
						<ToggleButtonGroup
							color="primary"
							value={willEditedItem?.styleAttributes?.flex.flexWrap}
							exclusive
							fullWidth
							onChange={(e) =>
								updateStyleAttribute("flex", "flexWrap", e.target.value)
							}
						>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="nowrap"
							>
								no wrap
							</ToggleButton>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="wrap"
							>
								wrap
							</ToggleButton>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="wrap-reverse"
							>
								wrap reverse
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
				</div>
				{/* Flex Wrap End */}
			</div>
		);
	}

	function renderAlignmentArea() {
		return (
			<div className="pg-menu-tab-style">
				{/* Justify Content Start */}
				<div>
					<div>JUSTIFY CONTENT</div>
					<div>
						<FormControl fullWidth>
							<Select
								size="small"
								value={
									willEditedItem?.styleAttributes.alignment.justifyContent ||
									"flex-start"
								}
								onChange={(e) =>
									updateStyleAttribute(
										"alignment",
										"justifyContent",
										e.target.value
									)
								}
							>
								<MenuItem value={"flex-start"}>flex start</MenuItem>
								<MenuItem value={"center"}>center</MenuItem>
								<MenuItem value={"flex-end"}>flex end</MenuItem>
								<MenuItem value={"space-between"}>space between</MenuItem>
								<MenuItem value={"space-around"}>space around</MenuItem>
								<MenuItem value={"space-evenly"}>space evenly</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
				{/* Justify Content End */}
				{/* Align Items Start */}
				<div className="space-from-top">
					<div>ALIGN ITEMS</div>
					<div>
						<FormControl fullWidth>
							<Select
								size="small"
								value={
									willEditedItem?.styleAttributes.alignment.alignItems || "auto"
								}
								onChange={(e) =>
									updateStyleAttribute(
										"alignment",
										"alignItems",
										e.target.value
									)
								}
							>
								<MenuItem value={"auto"}>auto</MenuItem>
								<MenuItem value={"flex-start"}>flex start</MenuItem>
								<MenuItem value={"center"}>center</MenuItem>
								<MenuItem value={"flex-end"}>flex end</MenuItem>
								<MenuItem value={"stretch"}>stretch</MenuItem>
								<MenuItem value={"baseling"}>baseline</MenuItem>
								<MenuItem value={"space-between"}>space between</MenuItem> 
								<MenuItem value={"space-around"}>space around</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
				{/* Align Items End */}
				{/* Align Self Start */}
				<div className="space-from-top">
					<div>ALIGN SELF</div>
					<div>
						<FormControl fullWidth>
							<Select
								size="small"
								disabled={isRootNode()}
								value={
									willEditedItem?.styleAttributes.alignment.alignSelf || "auto"
								}
								onChange={(e) =>
									updateStyleAttribute("alignment", "alignSelf", e.target.value)
								}
							>
								<MenuItem value={"auto"}>auto</MenuItem>
								<MenuItem value={"flex-start"}>flex start</MenuItem>
								<MenuItem value={"center"}>center</MenuItem>
								<MenuItem value={"flex-end"}>flex end</MenuItem>
								<MenuItem value={"stretch"}>stretch</MenuItem>
								<MenuItem value={"baseling"}>baseline</MenuItem>
								<MenuItem value={"space-between"}>space between</MenuItem> 
								<MenuItem value={"space-around"}>space around</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
				{/* Align Self End */}
				{/* Align Content Start */}
				<div className="space-from-top">
					<div>ALIGN CONTENT</div>
					<div>
						<FormControl fullWidth>
							<Select
								size="small"
								value={
									willEditedItem?.styleAttributes.alignment.alignContent ||
									"auto"
								}
								onChange={(e) =>
									updateStyleAttribute(
										"alignment",
										"alignContent",
										e.target.value
									)
								}
							>
								<MenuItem value={"auto"}>auto</MenuItem>
								<MenuItem value={"flex-start"}>flex start</MenuItem>
								<MenuItem value={"center"}>center</MenuItem>
								<MenuItem value={"flex-end"}>flex end</MenuItem>
								<MenuItem value={"stretch"}>stretch</MenuItem>
								<MenuItem value={"baseling"}>baseline</MenuItem>
								<MenuItem value={"space-between"}>space between</MenuItem> 
								<MenuItem value={"space-around"}>space around</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>
				{/* Align Content End */}
			</div>
		);
	}

	function renderLayoutArea() {
		return (
			<div className="pg-menu-tab-style">
				{/* Width Height Start */}
				<div>
					<div>WIDTH&nbsp;x&nbsp;HEIGHT</div>
					<div className="pg-menu-input-aligner">
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.width === "auto"
									? ""
									: willEditedItem?.styleAttributes?.layout.width
							}
							size="small"
							style={{ marginRight: "15px" }}
							placeholder="auto"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"width",
									e.target.value,
									true,
									"auto"
								)
							}
						/>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.height === "auto"
									? ""
									: willEditedItem?.styleAttributes?.layout.height
							}
							size="small"
							placeholder="auto"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"height",
									e.target.value,
									true,
									"auto"
								)
							}
						/>
					</div>
				</div>
				{/* Width Height End */}
				{/* MaxWidth x MaxHeight Start */}
				<div className="space-from-top">
					<div>MAX-WIDTH&nbsp;x&nbsp;MAX-HEIGHT</div>
					<div className="pg-menu-input-aligner">
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.maxWidth === "none"
									? ""
									: willEditedItem?.styleAttributes?.layout.maxWidth
							}
							size="small"
							placeholder="none"
							style={{ marginRight: "15px" }}
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"maxWidth",
									e.target.value,
									true,
									"none"
								)
							}
						/>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.maxHeight === "none"
									? ""
									: willEditedItem?.styleAttributes?.layout.maxHeight
							}
							size="small"
							placeholder="none"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"maxHeight",
									e.target.value,
									true,
									"none"
								)
							}
						/>
					</div>
				</div>
				{/* MaxWidth x MaxHeight End */}
				{/* MinWidth x MinHeight Start */}
				<div className="space-from-top">
					<div>MIN-WIDTH&nbsp;x&nbsp;MIN-HEIGHT</div>
					<div className="pg-menu-input-aligner">
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.minWidth === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.minWidth
							}
							size="small"
							placeholder="0"
							style={{ marginRight: "15px" }}
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"minWidth",
									e.target.value,
									true,
									0
								)
							}
						/>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.minHeight === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.minHeight
							}
							size="small"
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"minHeight",
									e.target.value,
									true,
									0
								)
							}
						/>
					</div>
				</div>
				{/* MinWidth x MinHeight End */}
				{/* Aspect Ratio Start */}
				<div className="space-from-top">
					<div>ASPECT RATIO</div>
					<div className="pg-menu-input-aligner">
						<TextField
							value={willEditedItem?.styleAttributes?.layout.aspectRatio}
							size="small"
							fullWidth
							placeholder="auto"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"aspectRatio",
									e.target.value,
									false
								)
							}
						/>
					</div>
				</div>
				{/* Aspect Ratio End */}
				{/* Padding Start */}
				<div className="space-from-top set-center">
					<div>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.paddingTop === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.paddingTop
							}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"paddingTop",
									e.target.value,
									true,
									0
								)
							}
						/>
					</div>
					<div className="order-side-by-side set-center-vertical">
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.paddingLeft === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.paddingLeft
							}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"paddingLeft",
									e.target.value,
									true,
									0
								)
							}
						/>
						<span className="give-space-horizontal">PADDING</span>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.paddingRight === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.paddingRight
							}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"paddingRight",
									e.target.value,
									true,
									0
								)
							}
						/>
					</div>
					<div>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.paddingBottom === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.paddingBottom
							}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"paddingBottom",
									e.target.value,
									true,
									0
								)
							}
						/>
					</div>
				</div>
				{/* Padding End */}
				{/* Margin Start */}
				<div className="space-from-top set-center">
					<div>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.marginTop === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.marginTop
							}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"marginTop",
									e.target.value,
									true,
									0
								)
							}
						/>
					</div>
					<div className="order-side-by-side set-center-vertical">
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.marginLeft === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.marginLeft
							}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"marginLeft",
									e.target.value,
									true,
									0
								)
							}
						/>
						<span className="give-space-horizontal">MARGIN</span>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.marginRight === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.marginRight
							}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"marginRight",
									e.target.value,
									true,
									0
								)
							}
						/>
					</div>
					<div>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.marginBottom === 0
									? ""
									: willEditedItem?.styleAttributes?.layout.marginBottom
							}
							size="small"
							disabled={isRootNode()}
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"marginBottom",
									e.target.value,
									true,
									0
								)
							}
						/>
					</div>
				</div>
				{/* Margin End */}
				{/* Position Type Start */}
				<div className="space-from-top">
					<div>POSITION TYPE</div>
					<div>
						<ToggleButtonGroup
							color="primary"
							value={willEditedItem?.styleAttributes?.layout?.positionType}
							disabled={isRootNode()}
							exclusive
							fullWidth
							onChange={(e) =>
								updateStyleAttribute("layout", "positionType", e.target.value)
							}
						>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="relative"
							>
								relative
							</ToggleButton>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="absolute"
							>
								absolute
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
				</div>
				{/* Position Type End */}
				{/* Position (top, right, bottom, left) Start */}
				<div className="space-from-top set-center">
					<div>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.top === null
									? ""
									: willEditedItem?.styleAttributes?.layout.top
							}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"top",
									e.target.value,
									true,
									null
								)
							}
						/>
					</div>
					<div className="order-side-by-side set-center-vertical">
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.left === null
									? ""
									: willEditedItem?.styleAttributes?.layout.left
							}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"left",
									e.target.value,
									true,
									null
								)
							}
						/>
						<span className="give-space-horizontal">POSITION</span>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.right === null
									? ""
									: willEditedItem?.styleAttributes?.layout.right
							}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"right",
									e.target.value,
									true,
									null
								)
							}
						/>
					</div>
					<div>
						<TextField
							value={
								willEditedItem?.styleAttributes?.layout.bottom === null
									? ""
									: willEditedItem?.styleAttributes?.layout.bottom
							}
							size="small"
							disabled={isRootNode()}
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute(
									"layout",
									"bottom",
									e.target.value,
									true,
									null
								)
							}
						/>
					</div>
				</div>
				{/* Position (top, right, bottom, left) End */}
			</div>
		);
	}
	//#endregion

	//#endregion

	return (
		<div className="pg-menu">
			<div className="pg-menu-share">
				<div className="pg-menu-share-item">Flex Attributes</div>
			</div>
			<div className="pg-menu-box">
				{selectedItemId === "" ? renderNoSelectedItem() : renderSelectedItem()}
			</div>
		</div>
	);
};

export default PGMenu;
