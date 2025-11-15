
'use client';

import * as React from 'react';

export type EpaycoData = {
    name: string;
    description: string;
    invoice: string;
    currency: string;
    amount: string;
    country: string;
    lang: string;
    external: string;
    response: string;
    confirmation: string;
    test: string;
    // Puedes añadir más campos opcionales aquí, como tax, tax_base, etc.
    [key: string]: string;
};

export function EpaycoForm({ data }: { data: EpaycoData }) {
    const formRef = React.useRef<HTMLFormElement>(null);

    const pCustId = process.env.NEXT_PUBLIC_EPAYCO_CUST_ID;
    const pKey = process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY;

    React.useEffect(() => {
        if (pCustId && pKey) {
            formRef.current?.submit();
        }
    }, [pCustId, pKey]);

    if (!pCustId || !pKey) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                <div className="bg-background p-8 rounded-lg text-center max-w-md">
                    <h3 className="text-xl font-bold text-destructive">Error de Configuración</h3>
                    <p className="mt-4 text-muted-foreground">
                        La pasarela de pago no ha sido configurada. Por favor, añade tus credenciales de ePayco en el archivo <code>.env.local</code> y reinicia el servidor de desarrollo.
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <form
            ref={formRef}
            method="POST"
            action="https://checkout.epayco.co/checkout.php"
            style={{ display: 'none' }}
        >
            <input name="p_cust_id" type="hidden" value={pCustId} />
            <input name="p_key" type="hidden" value={pKey} />
            {Object.entries(data).map(([key, value]) => (
                <input key={key} name={key} type="hidden" value={value} />
            ))}
        </form>
    );
}
