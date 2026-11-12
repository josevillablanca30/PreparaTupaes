# Conciliación de planes alojados en Mercado Pago

El checkout abierto desde `preapproval_plan_id` es el enlace general de un plan. Mercado Pago crea la suscripción durante ese checkout. Si llega sin `external_reference`, ¿Cachaste? no tiene el identificador reservado al iniciar una suscripción desde una sesión autenticada.

## Conciliar una suscripción sandbox elegible

1. El operador del proyecto verifica por canales de confianza que la persona controla la cuenta de ¿Cachaste? y la cuenta compradora de Mercado Pago. Registra una evidencia interna de esa comprobación en `cachaste_web.sandbox_hosted_ownership`, con los valores exactos de `user_id`, `provider_id` de la suscripción, `payer_id`, `collector_id` y `application_id`. La referencia `evidence_ref` apunta a la revisión interna. El rol de la aplicación y los endpoints públicos carecen de acceso de escritura a esa tabla.
2. Desde la cuenta administradora de QA verificada, invoca `POST /api/billing/sandbox` con la sesión vigente, `Content-Type: application/json` y `x-cachaste-request: 1`. `plan_payment_lookup` hace una consulta previa de solo lectura. `plan_payment_reconcile` usa la misma verificación y registra la asociación.

```json
{
  "action": "plan_payment_reconcile",
  "plan": "WEEKLY",
  "payerId": "<ID numérico del comprador>",
  "paymentId": "<ID numérico de la operación>"
}
```

El servidor toma el usuario de la sesión y consulta al vendedor chileno con credenciales sandbox. Comprueba el pago aprobado y sin reembolso con `live_mode=false`, la factura procesada y el mismo pago en el historial de la suscripción. La suscripción y el plan deben compartir la aplicación de Mercado Pago. La prueba de titularidad tiene que coincidir con esa cadena. Cada pago inicial y suscripción admiten una sola asociación.

El resultado aparece en el estado del panel de QA. Se puede actualizar con `refresh` y cancelar con `cancel` usando el ID de la suscripción. Un webhook firmado solo aplica cambios a una asociación existente o recupera una reserva mediante la referencia exacta que devuelve el proveedor. Las respuestas informan `processed`, `duplicate` o `ignored`. Un error recuperable devuelve 503 y el recibo queda pendiente.

El registro de sandbox queda en `sandbox_checkouts`. Los accesos de la web y Android siguen usando el estado común de Supabase y los pagos comerciales requieren su propia configuración y autorización.

## Operación del 11 de noviembre de 2026

| Recurso | Resultado de la API |
| --- | --- |
| Pago | `188037470295`, aprobado, CLP 2.490, sin reembolsos, `live_mode=true` |
| Factura | `7033905407`, procesada y asociada al pago exacto |
| Suscripción | `bec750fc3fdc4e15844e040ba495b993`, autorizada, sin `external_reference` |
| Plan | `d75a0a8983fe499188443d61b15f35ce`, semanal |
| Identidades | Vendedor chileno `test_user` `3829171412` y comprador `3829533074` |
| Aplicación de suscripción y plan | `5643907436179484` |

La simulación que Supabase recibió el 12 de noviembre a las 00:05 UTC con HTTP 200 se hizo desde la aplicación `48384472675774`. La entrega automática de la suscripción corresponde a la aplicación del vendedor de prueba `5643907436179484`. Mercado Pago tendría que aclarar la clasificación del recurso de pago para poder cerrar la validación con esa operación. La asociación permanece bloqueada por `live_mode=true`.

[Referencia de suscripciones](https://www.mercadopago.cl/developers/es/reference/online-payments/subscriptions/create-preapproval/post) · [Configuración de webhooks](https://www.mercadopago.cl/developers/es/docs/links-and-debts/additional-content/your-integrations/notifications/webhooks?scope=prod)
