import { createSlice } from '@reduxjs/toolkit';

const notifSlice = createSlice({
  name: "notifications",
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
      const { id } = action.payload;
      state.gestioneTicketNotifNumber = state.gestioneTicketNotifNumber.filter((notifId) => notifId !== id);
      state.mieiTicketNotifNumber = state.mieiTicketNotifNumber.filter((notifId) => notifId !== id);
    },
  },
});

export const { addNotification, deleteNotification } = notifSlice.actions;

export default notifSlice.reducer;
