import { createContext, useContext, useState } from "react";

const PaymentLockContext = createContext(null);

export const usePaymentLock = () => useContext(PaymentLockContext);


export const PaymentLockProvider = ({ children }) => {
    const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);

    return (
        <PaymentLockContext.Provider
            value={{ isPaymentInProgress, setIsPaymentInProgress }}
        >
            {children}
        </PaymentLockContext.Provider>
    );
};