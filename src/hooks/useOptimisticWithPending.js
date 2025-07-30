import { useState, useCallback } from 'react';

export function useOptimisticWithPending(initialValue) {
    const [optimisticValue, setOptimisticValue] = useState(initialValue);
    const [pendingActions, setPendingActions] = useState([]);
    const [stableValue, setStableValue] = useState(initialValue);

    const executeAction = useCallback(async (newOptimisticValue, actionFn) => {
        const actionId = Math.random().toString(36).substring(2, 9);

        try {
            setOptimisticValue(newOptimisticValue);
            setPendingActions(prev => [...prev, actionId]);
            await actionFn();
        } catch (error) {
            setOptimisticValue(stableValue);
        } finally {
            setPendingActions(prev => {
                const updated = prev.filter(id => id !== actionId);
                if (updated.length === 0) {
                    setStableValue(newOptimisticValue);
                }
                return updated;
            });
        }
    }, [stableValue]);

    return {
        optimisticValue,
        executeAction,
        isProcessing: pendingActions.length > 0,
    };
}
