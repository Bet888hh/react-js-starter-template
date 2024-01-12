import { useCallback, useEffect, useState } from 'react';

function useCustomHook() {

   const genericFetch= useCallback(async (url: string, options?: RequestInit): Promise<Response>=> {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.message) {
        throw new Error(data.message);
        //gestione errore sempre qua 
    }

    return response;
},[])
}

export default useCustomHook;
