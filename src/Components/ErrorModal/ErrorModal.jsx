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
                    <fieldset style={{width:"20%", marginLeft:"40%", marginTop:"4%"}}>
                        <div className="modal-overlay">
                            <div className="error-modal">
                                <div className="modal-header">
                                    <h2>Error</h2>
                                </div>
                                <div className="modal-body">
                                    <p>{JSON.stringify(error.error)}</p>
                                </div>
                                <div className="modal-footer">
                                    <button onClick={onClose}>Close</button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                )}
        </>
    );
});