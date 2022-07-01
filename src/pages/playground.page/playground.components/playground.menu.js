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
			<div className="pg-menu-tabpanel">
				<div>
					<div>DIRECTION</div>
					<div>
						<ToggleButtonGroup
							color="primary"
							value={willEditedItem?.styleAttributes?.flex.direction}
							exclusive
							fullWidth
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
						>
							<ToggleButton
								sx={{ padding: "3px 0", textTransform: "none" }}
								value="no-wrap"
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
			<div className="pg-menu-tabpanel">
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
			<div className="pg-menu-tabpanel">
				<div>
					<div>WIDTH&nbsp;x&nbsp;HEIGHT</div>
					<div className="pg-menu-input-aligner">
						<TextField
							value={willEditedItem?.styleAttributes?.layout.width}
							size="small"
							style={{ marginRight: "15px" }}
							onChange={(e) => {
								if (e.target.value.length === 0) {
									e.target.value = "0";
								}
								let clonedItem = JSON.parse(JSON.stringify(willEditedItem));
								clonedItem.styleAttributes.layout.width = parseInt(
									e.target.value
								);
								const editedDOM = JSON.parse(
									JSON.stringify(editDOM(DOM, clonedItem))
								);
								setDOM(editedDOM);
							}}
						/>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.height}
							size="small"
							onChange={(e) => {
								if (e.target.value.length === 0) {
									e.target.value = "0";
								}
								let clonedItem = JSON.parse(JSON.stringify(willEditedItem));
								clonedItem.styleAttributes.layout.height = parseInt(
									e.target.value
								);
								const editedDOM = JSON.parse(
									JSON.stringify(editDOM(DOM, clonedItem))
								);
								setDOM(editedDOM);
							}}
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
							onChange={(e) => {
								if (e.target.value.length === 0) {
									e.target.value = null;
								}
								let clonedItem = JSON.parse(JSON.stringify(willEditedItem));
								clonedItem.styleAttributes.layout.maxWidth = parseInt(
									e.target.value
								);
								const editedDOM = JSON.parse(
									JSON.stringify(editDOM(DOM, clonedItem))
								);
								setDOM(editedDOM);
							}}
						/>
						<TextField
							value={willEditedItem?.styleAttributes?.layout.maxHeight}
							size="small"
							placeholder="none"
							onChange={(e) => {
								if (e.target.value.length === 0) {
									e.target.value = null;
								}
								let clonedItem = JSON.parse(JSON.stringify(willEditedItem));
								clonedItem.styleAttributes.layout.maxHeight = parseInt(
									e.target.value
								);
								const editedDOM = JSON.parse(
									JSON.stringify(editDOM(DOM, clonedItem))
								);
								setDOM(editedDOM);
							}}
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
