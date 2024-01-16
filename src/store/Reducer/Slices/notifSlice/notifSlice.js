import { createSlice } from '@reduxjs/toolkit';

const notifSlice = createSlice({
  name: "notifSlice",
  initialState: {
    mieiTicketNotifNumber: [],
    gestioneTicketNotifNumber: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const { id, ruolo } = action.payload;
      ruolo === "OPERATORE" && state.gestioneTicketNotifNumber.push(id);
      ruolo === "SEMPLICE" && state.mieiTicketNotifNumber.push(id);
    },
    deleteNotification: (state, action) => {
     
        const  id  = action.payload;
      state.gestioneTicketNotifNumber = state.gestioneTicketNotifNumber.filter((notifId) => notifId !== id);
      state.mieiTicketNotifNumber = state.mieiTicketNotifNumber.filter((notifId) => notifId !== id);
    },
    setMieiTicketNotifNumber: (state, action) => {
      state.mieiTicketNotifNumber = [...new Set([...state.mieiTicketNotifNumber, ...action.payload])];
    },
    setGestioneTicketNotifNumber: (state, action) => {
      state.gestioneTicketNotifNumber = [...new Set([...state.gestioneTicketNotifNumber, ...action.payload])];
    },
  },
});

export default {[notifSlice.name]:notifSlice.reducer};
export const {setGestioneTicketNotifNumber, addNotification, deleteNotification,setMieiTicketNotifNumber } = notifSlice.actions;
export const SelectNotifSlice = (state) => state.notifSlice;