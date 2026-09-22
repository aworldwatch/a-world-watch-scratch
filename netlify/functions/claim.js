import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const store = getStore({
      name: "scratch-claims",
      consistency: "strong"
    });

    const discounts = [10, 15, 20, 25, 30];
    const discount =
      discounts[Math.floor(Math.random() * discounts.length)];

    const code =
      "AW-" +
      discount +
      "-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    await store.setJSON(crypto.randomUUID(), {
      code,
      discount,
      createdAt: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ code, discount }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Unable to generate discount" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
