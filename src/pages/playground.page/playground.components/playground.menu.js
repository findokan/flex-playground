import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { TabPanel, a11yProps } from "./playground.tabpanel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const PGMenu = ({ DOM, setDOM, selectedItemId, setSelectedItemId }) => {
	const [value, setValue] = useState(0);
	const [willEditedItem, setWillEditedItem] = useState(
		getSelectedItem(DOM, selectedItemId)
	);

	useEffect(() => {
		setWillEditedItem(getSelectedItem(DOM, selectedItemId));
	}, [DOM, selectedItemId]);

	const handleTabChange = (event, newValue) => {
		setValue(newValue);
	};

	//#region DOM MANIPULATION HELPERS
	function isRootNode() {
		return DOM.id === selectedItemId ? true : false;
	}

	function getSelectedItem(tempDOM, selectedItemId) {
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
		convertToInt = true
	) {
		if (!isNaN(value) && convertToInt) {
			value = parseInt(value);
		}

		let clonedItem = JSON.parse(JSON.stringify(willEditedItem));
		clonedItem.styleAttributes[parentTitle][attribute] = value;
		const editedDOM = JSON.parse(JSON.stringify(editDOM(DOM, clonedItem)));
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
		let selectedItem = JSON.parse(
			JSON.stringify(getSelectedItem(DOM, selectedItemId))
		);
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
		const editedDOM = JSON.parse(JSON.stringify(editDOM(DOM, selectedItem)));
		setDOM(editedDOM);
	}

	function deleteNode() {
		let parentItem = JSON.parse(
			JSON.stringify(getParentItem(DOM, selectedItemId))
		);
		const childIndex = parentItem.children.findIndex(
			(child) => child.id === selectedItemId
		);
		parentItem.children.splice(childIndex, 1);
		const editedDOM = JSON.parse(JSON.stringify(editDOM(DOM, parentItem)));
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
					<Box className="pg-menu-tab-container">
						<Tabs
							className="pg-menu-tab-box"
							value={value}
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
					<TabPanel className="pg-menu-tab-panel" value={value} index={0}>
						{renderFlexArea()}
					</TabPanel>
					<TabPanel className="pg-menu-tab-panel" value={value} index={1}>
						{renderAlignmentArea()}
					</TabPanel>
					<TabPanel className="pg-menu-tab-panel" value={value} index={2}>
						{renderLayoutArea()}
					</TabPanel>
				</Box>
				{renderAddRMNodeButtons()}
			</>
		);
	}

	//#region MENU TAB PANEL RENDERS
	function renderFlexArea() {
		console.log("renderFlexArea", willEditedItem);
		return (
			<div className="pg-menu-tab-style">
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
				<div className="space-from-top order-side-by-side">
					<div className="set-center">
						<div>BASIS</div>
						<div>
							<TextField
								size="small"
								disabled={isRootNode()}
								value={willEditedItem?.styleAttributes?.flex?.basis}
								placeholder="auto"
								onChange={(e) =>
									updateStyleAttribute("flex", "basis", e.target.value)
								}
							/>
						</div>
					</div>
					<div className="set-center give-space-horizontal">
						<div>GROW</div>
						<div>
							<TextField
								size="small"
								disabled={isRootNode()}
								value={willEditedItem?.styleAttributes?.flex?.grow}
								placeholder="0"
								onChange={(e) =>
									updateStyleAttribute("flex", "grow", e.target.value)
								}
							/>
						</div>
					</div>
					<div className="set-center">
						<div>SHRINK</div>
						<div>
							<TextField
								size="small"
								disabled={isRootNode()}
								value={willEditedItem?.styleAttributes?.flex?.shrink}
								placeholder="1"
								onChange={(e) =>
									updateStyleAttribute("flex", "shrink", e.target.value)
								}
							/>
						</div>
					</div>
				</div>
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
			</div>
		);
	}

	function renderAlignmentArea() {
		return (
			<div className="pg-menu-tab-style">
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
			</div>
		);
	}

	function renderLayoutArea() {
		return (
			<div className="pg-menu-tab-style">
				<div>
					<div>WIDTH&nbsp;x&nbsp;HEIGHT</div>
					<div className="pg-menu-input-aligner">
						<TextField
							value={willEditedItem?.styleAttributes?.layout.width}
							size="small"
							style={{ marginRight: "15px" }}
							onChange={(e) =>
								updateStyleAttribute("layout", "width", e.target.value)
							}
						/>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.height}
							size="small"
							onChange={(e) =>
								updateStyleAttribute("layout", "height", e.target.value)
							}
						/>
					</div>
				</div>
				<div className="space-from-top">
					<div>MAX-WIDTH&nbsp;x&nbsp;MAX-HEIGHT</div>
					<div className="pg-menu-input-aligner">
						<TextField
							value={willEditedItem?.styleAttributes?.layout.maxWidth}
							size="small"
							placeholder="none"
							style={{ marginRight: "15px" }}
							onChange={(e) =>
								updateStyleAttribute("layout", "maxWidth", e.target.value)
							}
						/>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.maxHeight}
							size="small"
							placeholder="none"
							onChange={(e) =>
								updateStyleAttribute("layout", "maxHeight", e.target.value)
							}
						/>
					</div>
				</div>
				<div className="space-from-top">
					<div>MIN-WIDTH&nbsp;x&nbsp;MIN-HEIGHT</div>
					<div className="pg-menu-input-aligner">
						<TextField
							value={willEditedItem?.styleAttributes?.layout.minWidth}
							size="small"
							placeholder="0"
							style={{ marginRight: "15px" }}
							onChange={(e) =>
								updateStyleAttribute("layout", "minWidth", e.target.value)
							}
						/>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.minHeight}
							size="small"
							placeholder="0"
							onChange={(e) =>
								updateStyleAttribute("layout", "minHeight", e.target.value)
							}
						/>
					</div>
				</div>
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
				<div className="space-from-top set-center">
					<div>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.paddingTop}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "paddingTop", e.target.value)
							}
						/>
					</div>
					<div className="order-side-by-side set-center-vertical">
						<TextField
							value={willEditedItem?.styleAttributes?.layout.paddingLeft}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "paddingLeft", e.target.value)
							}
						/>
						<span className="give-space-horizontal">PADDING</span>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.paddingRight}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "paddingRight", e.target.value)
							}
						/>
					</div>
					<div>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.paddingBottom}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "paddingBottom", e.target.value)
							}
						/>
					</div>
				</div>
				<div className="space-from-top set-center">
					<div>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.marginTop}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "marginTop", e.target.value)
							}
						/>
					</div>
					<div className="order-side-by-side set-center-vertical">
						<TextField
							value={willEditedItem?.styleAttributes?.layout.marginLeft}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "marginLeft", e.target.value)
							}
						/>
						<span className="give-space-horizontal">MARGIN</span>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.marginRight}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "marginRight", e.target.value)
							}
						/>
					</div>
					<div>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.marginBottom}
							size="small"
							disabled={isRootNode()}
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "marginBottom", e.target.value)
							}
						/>
					</div>
				</div>
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
				<div className="space-from-top set-center">
					<div>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.top}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "top", e.target.value)
							}
						/>
					</div>
					<div className="order-side-by-side set-center-vertical">
						<TextField
							value={willEditedItem?.styleAttributes?.layout.left}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "left", e.target.value)
							}
						/>
						<span className="give-space-horizontal">POSITION</span>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.right}
							disabled={isRootNode()}
							size="small"
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "right", e.target.value)
							}
						/>
					</div>
					<div>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.bottom}
							size="small"
							disabled={isRootNode()}
							inputProps={{ style: { textAlign: "center", maxWidth: "40px" } }}
							onChange={(e) =>
								updateStyleAttribute("layout", "bottom", e.target.value, false)
							}
						/>
					</div>
				</div>
			</div>
		);
	}
	//#endregion

	//#endregion

	return (
		<div className="pg-menu">
			<div className="pg-menu-share">
				<div className="pg-menu-share-item">Get Code</div>
				<div className="pg-menu-share-item">Share</div>
			</div>
			<div className="pg-menu-box">
				{selectedItemId === "" ? renderNoSelectedItem() : renderSelectedItem()}
			</div>
		</div>
	);
};

export default PGMenu;
