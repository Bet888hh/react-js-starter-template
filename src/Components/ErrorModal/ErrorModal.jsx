import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectErrorSlice, clearError } from '../../store/Reducer/Slices/ErrorSlice/ErrorSlice';

export const ErrorModal = memo(function ErrorModal() {
    const error = useSelector(SelectErrorSlice);
    const dispatch = useDispatch();

    const onClose = useCallback(() => {
        dispatch(clearError());
    }, [])

    return (
        <>
            {error.error != null
                && (
                    <fieldset style={{width:"40%", marginLeft:"35%", marginTop:"4%",height:"10%"}}>
                        <div className="modal-overlay">
                            <div >
                             
                                    
                               
                                
                                    <span style={{marginRight:"10px"}}>{JSON.stringify(error.error)}</span>
                               
                              
                                    <button onClick={onClose}>Close</button>
                                
                            </div>
                        </div>
                    </fieldset>
                )}
        </>
    );
});