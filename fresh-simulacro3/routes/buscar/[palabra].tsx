import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Axios from "axios";
type Definition = {
  definition: string;
  example?: string;
};

type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
};

type APIWord = {
  word: string;
  meanings: Meaning[];
};

export const handler: Handlers = {
  GET: async (_req: Request, ctx: FreshContext<unknown, APIWord>) => {
    const word = ctx.params.palabra;
    if (!word) {
      return ctx.render();
    }

    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const response = await Axios.get<APIWord[]>(url);
      return ctx.render(response.data[0]);
    } catch (_e) {
      return new Response("API Error", { status: 500 });
    }
  },
};

const Page = (props: PageProps<APIWord>) => {
  const { data } = props;

  return (
    <div>
      <div>
        <a href={"/"} class="Volver">Volver Atrás</a>
      </div>
      {data &&
        (
          <div>
            <div>
              <p>
                <strong>Palabra:</strong> {data.word}
              </p>
            </div>
            <br></br>

            {data.meanings.map((meaning) => (
              <div>
                <br></br>
                <p>
                  <strong>Tipo:</strong> {meaning.partOfSpeech}
                </p>

                {meaning.definitions.map((def) => (
                  <p>
                    <strong>Definición:{" "}</strong>

                    <span>
                      {" "}
                      {def.definition}
                    </span>
                    {def.example && (
                      <p>
                        <strong>Ejemplo:{" "}</strong>

                        <span>
                          {def.example}
                        </span>
                      </p>
                    )}
                  </p>
                ))}
                <p>
                  <strong>Sinónimos:{" "}</strong>
                  {meaning.synonyms && meaning.synonyms.length > 0
                    ? meaning.synonyms.map((m, i) => (
                      <span key={i}>
                        <a href={`/buscar/${m}`}>{m}</a>
                        {i < (meaning.synonyms ?? []).length - 1 && ", "}
                      </span>
                    ))
                    : "Ninguno"}
                </p>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Page;
