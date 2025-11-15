
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

function PaymentStatus() {
    const searchParams = useSearchParams();
    const refPayco = searchParams.get('ref_payco');

    const [transaction, setTransaction] = React.useState<any | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (refPayco) {
            const url = `https://secure.epayco.co/validation/v1/reference/${refPayco}`;
            
            // Usamos un 'proxy' a través de una ruta de API de Next.js para evitar problemas de CORS
            fetch(`/api/epayco-check?url=${encodeURIComponent(url)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('La respuesta de la red no fue exitosa.');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        setTransaction(data.data);
                    } else {
                        throw new Error(data.data.description || 'Error desconocido de ePayco');
                    }
                })
                .catch(err => {
                    console.error("Error al validar la transacción:", err);
                    setError(err.message || 'No se pudo verificar el estado de la transacción.');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError('No se encontró una referencia de pago.');
            setLoading(false);
        }
    }, [refPayco]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <Loader className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Verificando estado del pago...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
                <XCircle className="h-12 w-12 text-destructive" />
                <h3 className="text-xl font-semibold">Error en la Verificación</h3>
                <p className="text-muted-foreground">{error}</p>
            </div>
        );
    }
    
    if (!transaction) return null;

    const { status, response, amount, currency } = transaction;

    const statusConfig = {
        Aceptada: {
            icon: <CheckCircle className="h-12 w-12 text-green-500" />,
            title: '¡Pago Aprobado!',
            cardClass: 'border-green-500',
        },
        Rechazada: {
            icon: <XCircle className="h-12 w-12 text-destructive" />,
            title: 'Pago Rechazado',
            cardClass: 'border-destructive',
        },
        Pendiente: {
            icon: <AlertCircle className="h-12 w-12 text-yellow-500" />,
            title: 'Pago Pendiente',
            cardClass: 'border-yellow-500',
        },
        Fallida: {
            icon: <XCircle className="h-12 w-12 text-destructive" />,
            title: 'Pago Fallido',
            cardClass: 'border-destructive',
        },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pendiente;

    return (
        <Card className={`w-full max-w-md ${config.cardClass}`}>
            <CardHeader className="items-center text-center">
                {config.icon}
                <CardTitle className="text-2xl mt-4">{config.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                <p className="text-muted-foreground">{response}</p>
                <div className="text-3xl font-bold">
                    ${parseInt(amount, 10).toLocaleString('es-CO')} <span className="text-lg text-muted-foreground">{currency.toUpperCase()}</span>
                </div>
                <div className="text-sm text-muted-foreground pt-4">
                    <p>Referencia ePayco:</p>
                    <p className="font-mono">{refPayco}</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/arte-y-colecciones">Volver a la tienda</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function PaymentResponsePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <React.Suspense fallback={<div>Cargando...</div>}>
                <PaymentStatus />
            </React.Suspense>
        </div>
    );
}
