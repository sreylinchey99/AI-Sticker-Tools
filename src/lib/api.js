import { fal } from "@fal-ai/client";

fal.config({
    credentials: import.meta.env.VITE_FAL_KEY
});

export async function generateImage({ prompt, image_url, num_images }) {
    // Basic validations to help surface common causes of a 422 from the API
    if (!prompt || typeof prompt !== "string") {
        throw new Error("generateImage: missing or invalid 'prompt' string");
    }

    if (!image_url || typeof image_url !== "string" || !/^https?:\/\//i.test(image_url)) {
        throw new Error("generateImage: 'image_url' must be a publicly accessible URL (https://...)");
    }

    const n = Math.max(1, Math.min(Number(num_images) || 1, 4)); // clamp 1..4

    try {
        const result = await fal.subscribe("fal-ai/nano-banana/edit", {
            // Some Fal functions expect `image_urls` (array) instead of a single `image_url` field.
            // Provide both to be tolerant: include the array required by the function and keep
            // the single `image_url` for older/alternate schemas.
            input: {
                prompt,
                image_url,
                image_urls: [image_url],
                num_images: n,
                // add more optional parameters required by your function here
            },
            log: true,
            onQueueUpdate: (update) => {
                // print queue updates (position, logs, status)
                if (update && update.status) {
                    console.log("queue update:", update.status, update);
                }
                if (Array.isArray(update.logs)) {
                    update.logs.map((log) => log.message).forEach(console.log);
                }
            },
        });

        console.log("fal subscribe result:", result);
        // result.data is commonly where function outputs live, but logging full result helps debug
        return result.data;
    } catch (err) {
        // Log rich error information so you can inspect the 422 body in the browser console
        console.error("generateImage error:", err);
        // some errors include a `response`/`body` property from the client; log them if present
        try {
            if (err && err.response) console.error("error.response:", err.response);
            if (err && err.body) {
                // Log a JSON string so it's easy to read in environments that collapse objects
                try {
                    console.error("error.body:", JSON.stringify(err.body, null, 2));
                }
                catch (_) {
                    console.error("error.body (raw):", err.body);
                }

                // If the API returned a `detail` array (common for validation errors), print the first item
                if (Array.isArray(err.body.detail) && err.body.detail.length > 0) {
                    try {
                        console.error("error.body.detail[0]:", JSON.stringify(err.body.detail[0], null, 2));
                    }
                    catch (_) {
                        console.error("error.body.detail[0] (raw):", err.body.detail[0]);
                    }
                }
            }
        }
        catch (e) {
            // ignore logging errors
        }
        throw err;
    }
}