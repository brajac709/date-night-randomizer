import { VercelRequest, VercelResponse } from "@vercel/node";

export default function (request: VercelRequest, response: VercelResponse) {
  response.status(200).send(/*{
    message: `Hello from ${process.env.VERCEL_REGION}`
  }*/ 
 `Hello from ${process.env.VERCEL_REGION}`
    );
};