import { useState, useCallback, useRef } from 'react';

export function useOptimisticWithPending(initialValue) {
    const [optimisticValue, setOptimisticValue] = useState(initialValue);
    const [pendingActions, setPendingActions] = useState([]);
    const stableValueRef = useRef(initialValue); // Usando ref para evitar problemas de closure

    const executeAction = useCallback(async (newOptimisticValue, actionFn) => {
        const actionId = Math.random().toString(36).substring(2, 9);
        const currentStableValue = stableValueRef.current; // Captura o valor atual

        try {
            // Atualização otimista
            setOptimisticValue(newOptimisticValue);
            setPendingActions(prev => [...prev, actionId]);

            // Executa a ação
            await actionFn();

            // Atualiza o valor estável
            stableValueRef.current = newOptimisticValue;
        } catch (error) {
            // Reverte para o valor estável capturado no início
            setOptimisticValue(currentStableValue);

        } finally {
            // Remove a ação pendente
            setPendingActions(prev => prev.filter(id => id !== actionId));
        }
    }, []); // Sem dependências - função estável

    return {
        optimisticValue,
        executeAction,
        isProcessing: pendingActions.length > 0
    };
}