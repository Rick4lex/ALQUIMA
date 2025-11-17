
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

    const pCustId = process.env.NEXT_PUBLIC_P_CUST_ID_CLIENTE;
    const pKey = process.env.NEXT_PUBLIC_P_KEY;

    React.useEffect(() => {
        // Da un ciclo de renderizado para asegurar que las variables de entorno se carguen
        const timer = setTimeout(() => {
            if (pCustId && pKey) {
                formRef.current?.submit();
            }
        }, 100); // Un pequeño retraso es suficiente

        return () => clearTimeout(timer);
    }, [pCustId, pKey, data]);

    if (!pCustId || !pKey) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                <div className="bg-background p-8 rounded-lg text-center max-w-md">
                    <h3 className="text-xl font-bold text-destructive">Error de Configuración</h3>
                    <p className="mt-4 text-muted-foreground">
                        La pasarela de pago no está configurada correctamente. Por favor, verifica que las credenciales de ePayco (variables de entorno) se hayan añadido correctamente en la configuración del proyecto.
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
