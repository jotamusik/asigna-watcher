import * as querystring from "querystring";
import * as http from "http";

export const getStateQueryResponse = (orderId) : Promise<string> => new Promise(async (resolve, reject) => {
  const postData = querystring.stringify({
    'expedicion': orderId
  });
  const options = {
    hostname: '194.224.25.194',
    port: 8082,
    path: '/trazabilidad/components/consulta.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      resolve(data);
    });
  });

  req.on('error', (error) => {
    reject(error);
  });

  req.write(postData);
  req.end();
});
