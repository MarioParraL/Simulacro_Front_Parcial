import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: (req: Request, ctx: FreshContext) => {
    const url = new URL(req.url);
    const word = url.searchParams.get("word");

    if (word) {
      return new Response("", {
        status: 307,
        headers: { Location: `/buscar/${word}` },
      });
    }

    return ctx.render();
  },
};

const Page = () => {
  return (
    <div>
      <form method="GET" action="/">
        <input
          type="text"
          name="word"
          placeholder="Escribe una palabra"
          required
        />
        <button type="submit">Buscar Palabra</button>
      </form>
    </div>
  );
};

export default Page;
