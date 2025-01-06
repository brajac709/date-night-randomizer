export function GET(request) {
    console.log("Test");
    return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}