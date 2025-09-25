
import { useState, useCallback } from 'react';

const useToggle = () => {
    const [state, setState] = useState(false); 

    const toggle = useCallback(() => {
        setState(prev => !prev);
    }, []);

    return [state, toggle];
};

export default useToggle;
