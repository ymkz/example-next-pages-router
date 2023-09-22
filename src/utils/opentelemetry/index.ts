import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { Resource } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  instrumentations: [new PinoInstrumentation(), new HttpInstrumentation()],
  metricReader: new PrometheusExporter({ port: 3001 }),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'example-service',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.APP_ENV,
  }),
})

sdk.start()
