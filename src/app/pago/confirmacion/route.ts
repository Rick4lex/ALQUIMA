
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    console.log("=== NOTIFICACIÓN DE EPAYCO RECIBIDA ===");
    console.log(JSON.stringify(data, null, 2));
    
    const p_cust_id = process.env.NEXT_PUBLIC_EPAYCO_CUST_ID;
    // Aquí deberías tener una llave de firma privada, pero la pública sirve para validación básica
    const p_key = process.env.NEXT_PUBLIC_EPAYCO_PUBLIC_KEY; 

    // Aquí iría la lógica para validar la firma (p_signature) si la estás usando
    // Por ahora, solo registramos la confirmación.

    const { x_cod_response, x_response } = data;

    // Lógica futura:
    // 1. Validar la firma para asegurar que la notificación es de ePayco.
    // 2. Buscar la orden en tu base de datos usando `x_ref_payco` o `x_id_invoice`.
    // 3. Actualizar el estado del pedido según `x_cod_response`:
    //    - 1: Aprobada -> Marcar pedido como pagado, enviar email, despachar producto.
    //    - 2: Rechazada -> Marcar pedido como cancelado.
    //    - 3: Pendiente -> Mantener pedido como pendiente.
    //    - 4: Fallida -> Marcar pedido como fallido.

    console.log(`Respuesta de ePayco: ${x_response} (Código: ${x_cod_response})`);

    // ePayco espera una respuesta 200 OK para saber que recibiste la notificación.
    return NextResponse.json({ success: true, message: "Confirmación recibida" });

  } catch (error) {
    console.error("Error al procesar la confirmación de ePayco:", error);
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 });
  }
}
