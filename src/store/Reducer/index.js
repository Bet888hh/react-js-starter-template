import { combineReducers } from "@reduxjs/toolkit";
import slices from "./Slices";

const rootReducer = combineReducers(slices)

export default rootReducer;