import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { NodeSDK } from '@opentelemetry/sdk-node'

const sdk = new NodeSDK({
  instrumentations: [new HttpInstrumentation(), new PinoInstrumentation()],
  metricReader: new PrometheusExporter({ port: 3001 }),
})

sdk.start()
