import { loggingRedactPaths } from '@/constants/app.constant';
import { type IncomingMessage, type ServerResponse } from 'http';
import { Params } from 'nestjs-pino';
import { GenReqId, Options, type ReqId } from 'pino-http';
import { v4 as uuidv4 } from 'uuid';

const genReqId: GenReqId = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const id: ReqId = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-Id', id.toString());
  return id;
};

const customSuccessMessage = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  responseTime: number,
) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - ${responseTime} ms`;
};

const customReceivedMessage = (req: IncomingMessage) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}"`;
};

const customErrorMessage = (req, res, err) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - message: ${err.message}`;
};

function loggerFactory(): Params {
  const pinoHttpOptions: Options = {
    level: 'debug',
    genReqId: genReqId,
    serializers: {
      req: (req) => {
        req.body = req.raw.body;
        return req;
      },
    },
    customSuccessMessage,
    customReceivedMessage,
    customErrorMessage,
    redact: {
      paths: loggingRedactPaths,
      censor: '**GDPR COMPLIANT**',
    }, // Redact sensitive information
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
        levelFirst: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore:
          'req.id,req.method,req.url,req.headers,req.remoteAddress,req.remotePort,res.headers',
      },
    },
  };

  return {
    pinoHttp: pinoHttpOptions,
  };
}

export default loggerFactory;
