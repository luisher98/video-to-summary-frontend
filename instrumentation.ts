export function register() {
    if (!process.env.API_URL) {
        throw new Error("Missing environment variable API_URL");
    }
}