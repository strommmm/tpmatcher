import * as winston from "winston";
import * as moment from "moment";

const logger = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return moment().format("YYYY-MM-DD HH:mm:ss");
      },
      formatter: function(options: any) {
        return '[' + options.timestamp() +' '+ options.level.toUpperCase() +'] '+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ]
});

export default logger;
