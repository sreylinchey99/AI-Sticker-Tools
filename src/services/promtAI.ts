// import { pipeline } from '@huggingface/transformers';

// let textGenerator: any = null;

// const initializeAI = async () => {
//   if (!textGenerator) {
//     try {
//       // Use a small, fast text generation model
//       textGenerator = await pipeline(
//         'text-generation',
//         'Xenova/distilgpt2',
//         { 
//           device: 'webgpu',
//           // Fallback to CPU if WebGPU not available
//           dtype: 'fp16'
//         }
//       );
//     } catch (error) {
//       // Fallback to CPU if WebGPU fails
//       textGenerator = await pipeline(
//         'text-generation',
//         'Xenova/distilgpt2'
//       );
//     }
//   }
//   return textGenerator;
// };

// export const improvePrompt = async (userPrompt: string): Promise<string> => {
//   try {
//     if (!userPrompt.trim()) {
//       return "kawaii anime style with big sparkly eyes and pastel colors";
//     }

//     const generator = await initializeAI();
    
//     // Create a prompt template for style improvement
//     const enhancementPrompt = `Transform this basic style description into a detailed, artistic prompt for generating stickers:

// Basic style: ${userPrompt}

// Detailed artistic prompt: `;

//     const result = await generator(enhancementPrompt, {
//       max_new_tokens: 50,
//       temperature: 0.7,
//       do_sample: true,
//       top_p: 0.9,
//       repetition_penalty: 1.1
//     });

//     // Extract the generated text and clean it up
//     let improvedPrompt = result[0].generated_text.replace(enhancementPrompt, '').trim();
    
//     // Clean up and ensure it's a good prompt
//     improvedPrompt = improvedPrompt
//       .replace(/[\n\r]+/g, ' ')
//       .replace(/\s+/g, ' ')
//       .trim();

//     // If the result is too short or doesn't make sense, provide fallback
//     if (improvedPrompt.length < 20 || !improvedPrompt.includes('style')) {
//       return enhancePromptLocally(userPrompt);
//     }

//     return improvedPrompt.substring(0, 200); // Limit length
//   } catch (error) {
//     console.warn('AI prompt improvement failed, using local enhancement:', error);
//     return enhancePromptLocally(userPrompt);
//   }
// };

// // Fallback function for prompt enhancement without AI
// const enhancePromptLocally = (userPrompt: string): string => {
//   const keywords = userPrompt.toLowerCase();
  
//   // Style enhancement rules
//   const enhancements: Record<string, string> = {
//     'kawaii': 'kawaii anime style with big sparkly eyes, soft pastel colors, cute expressions, and adorable details',
//     'anime': 'detailed anime art style with vibrant colors, expressive eyes, and smooth shading',
//     'cartoon': 'cartoon style with bold outlines, bright colors, and exaggerated features',
//     'realistic': 'photorealistic style with natural lighting, detailed textures, and lifelike proportions',
//     'minimalist': 'clean minimalist style with simple lines, geometric shapes, and limited color palette',
//     'watercolor': 'soft watercolor painting style with flowing colors, gentle brushstrokes, and artistic blending',
//     'pixel': 'retro pixel art style with 8-bit aesthetics, blocky shapes, and nostalgic gaming vibes',
//     'chibi': 'super cute chibi style with oversized heads, tiny bodies, and adorable proportions'
//   };

//   // Find matching enhancement
//   for (const [key, enhancement] of Object.entries(enhancements)) {
//     if (keywords.includes(key)) {
//       return enhancement;
//     }
//   }

//   // Default enhancement
//   return `${userPrompt} with high quality artwork, vibrant colors, and professional digital art style`;
// };

// export const generateRandomPrompt = (): string => {
//   const styles = [
//     "kawaii anime style with sparkly eyes and pastel rainbow colors",
//     "dreamy watercolor style with soft edges and flowing magical elements",
//     "bold cartoon style with thick outlines and vibrant neon colors",
//     "minimalist geometric style with clean lines and modern aesthetics",
//     "realistic portrait style with natural lighting and detailed textures",
//     "retro pixel art style with 8-bit gaming aesthetics and blocky charm",
//     "chibi style with oversized heads and adorable tiny proportions",
//     "magical girl style with glittery effects and ethereal lighting",
//     "street art style with graffiti elements and urban vibes",
//     "manga style with dramatic expressions and dynamic shading"
//   ];
  
//   return styles[Math.floor(Math.random() * styles.length)];
// };