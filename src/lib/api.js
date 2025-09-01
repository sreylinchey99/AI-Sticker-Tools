import { fal } from "@fal-ai/client";

fal.config({
    credentials: import.meta.env.VITE_FAL_KEY
});

export async function generateImage({ prompt, image_url, num_images }) {
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
        input: {
            prompt,
            image_url,
            num_images,
            // selected_style,
            // num_images: state.quantity,
            // aspect_ratio,
            // add more optional parameter if needed
        },
        log: true,
        onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
                update.logs.map((log) => log.message).forEach(console.log);
            }
        },
    });
    console.log(result.data);
    console.log(result.requestId);
    return result.data; // contain the generated images
}