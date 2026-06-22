import { useState } from "react";
import styled, {createGlobalStyle} from "styled-components"


/* 
esse tipo descreve o objeto que é guardado no estado "resultado"
o | null significa que o valor pode ser nulo (antes de calcular)
*/
type Resultado = {
  semanasVividas: number;
  semanasRestantes: number;
} | null;

// expectativa de vida mediana (em anos)
const EXPECTATIVA_DE_VIDA_ANOS: number = 80;

// Total de semanas em uma vida (80 anos x 52 semanas)
const TOTAL_SEMANAS: number = EXPECTATIVA_DE_VIDA_ANOS * 52;



// ESTILOS GLOBAIS
const EstiloGlobal = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #0d0d0d;
    color: #e5e5e5;
    font-family: 'Courier New', Courier, monospace;
    min-height: 100vh;
  }
`;


// COMPONENTES ESTILIZADOS
const Pagina = styled.div`
  max-width: 920px;
  margin: 0 auto;
  padding: 48px 24px 80px;
`;

const Titulo = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const Subtitulo = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 48px;
`;

const Formulario = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
`;

// o "label" melhora acessibilidade: clicar nele foca o input
const Label = styled.label`
  font-size: 0.85rem;
  color: #888;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputData = styled.input`
  background: #1a1a1a;
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  padding: 12px 16px;
  color: #e5e5e5;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #4ade80;
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(0.6);
    cursor: pointer;
  }
`;

const Botao = styled.button`
  background: #4ade80;
  color: #0d0d0d;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  align-self: flex-end;
  transition: background 0.15s;

  &:hover {
    background: #86efac;
  }

  &:active {
    background: #22c55e;
  }
`;

const MensagemErro = styled.p`
  color: #f87171;
  font-size: 0.85rem;
  margin-top: -36px;
  margin-bottom: 36px;
`;

const AreaResultado = styled.div``;

const Estatisticas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 32px;
`;

const Estatistica = styled.p`
  font-size: 0.85rem;
  color: #666;

  span {
    color: #4ade80;
    font-weight: 700;
  }
`;

const GridSemanas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
`;


// styled component com prop customizada.
// no TS, precisamos declarar o tipo da prop explicitamente pro compilador não reclamar
type QuadradoProps = {
  $vivida: boolean;
};

const Quadrado = styled.div<QuadradoProps>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: ${(props) => (props.$vivida ? "#4ade80" : "transparent")};
  border: 1px solid ${(props) => (props.$vivida ? "#3d8c5a" : "#1e1e1e")};
`;

const Legenda = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ItemLegenda = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #555;
`;

// reusa o tipo QuadradoProps no quadradinho da legenda também
const QuadradoLegenda = styled.div<QuadradoProps>`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: ${(props) => (props.$vivida ? "#4ade80" : "transparent")};
  border: 1px solid ${(props) => (props.$vivida ? "#3d8c5a" : "#1e1e1e")};
`;


// função utilitaria
// fica fora do componente porque não depende de estado.
function calcularSemanasVividas(dataNascimento: string): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  // diferenã em milissegundos entre hoje e o nascimento
  const diferencaMs: number = hoje.getTime() - nascimento.getTime();

  // converte ms -> semanas completas
  const semanas: number = Math.floor(diferencaMs / (1000 * 60 * 60 * 24 *7))

  return semanas;
}


// componente principal
export default function App() {
  const [dataNascimento, setDataNascimento] = useState<string>("");

  // usestate<resultado> pode ser o objeto com numeros ou null
  const [resultado,  setResultado] = useState<Resultado>(null);

  // mensagem de erro.
  const [erro, setErro] = useState<string>("");

  // função chamada ao clicar no button
  function handleSubmit(): void {
    setErro("");

    if (!dataNascimento) {
      setErro("Por favor, insira sua data de nascimento");
      return;
    }

    const nascimento = new Date(dataNascimento);
    const hoje = new Date();

    if (nascimento > hoje) {
      setErro("A data de nascimento não pode ser no futuro.");
      return;
    }

    const semanasVividas = calcularSemanasVividas(dataNascimento);
    const semanasRestantes = Math.max(0, TOTAL_SEMANAS - semanasVividas);

    setResultado({semanasVividas, semanasRestantes})
  }



  // RENDERIZAÇÃO
  return (
    <>
      <EstiloGlobal />

      <Pagina>
        <Titulo>Sua vida em semanas</Titulo>
        <Subtitulo>
          Cada quadrado é uma semana. Quantas semanas você já viveu?
        </Subtitulo>

        <Formulario>
          <Label htmlFor="data-nascimento">
            Data de nascimento
            <InputData
              id="data-nascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
          </Label>
          <Botao onClick={handleSubmit}>Calcular</Botao>
        </Formulario>

        {/* mostra o erro se existir (string não vazia = truthy) */}
        {erro && <MensagemErro>{erro}</MensagemErro>}

        {/* só renderiza o resultado se não for null */}
        {resultado !== null && (
          <AreaResultado>
            <Estatisticas>
              <Estatistica>
                Semanas vividas:{" "}
                <span>{resultado.semanasVividas.toLocaleString("pt-BR")}</span>
              </Estatistica>
              <Estatistica>
                Semanas restantes (estimativa):{" "}
                <span>
                  {resultado.semanasRestantes.toLocaleString("pt-BR")}
                </span>
              </Estatistica>
              <Estatistica>
                Total considerado:{" "}
                <span>
                  {TOTAL_SEMANAS.toLocaleString("pt-BR")} semanas (
                  {EXPECTATIVA_DE_VIDA_ANOS} anos)
                </span>
              </Estatistica>
            </Estatisticas>

            {/*
              Array.from gera um array com TOTAL_SEMANAS posições.
              Para cada posição (índice), cria um <Quadrado />.
              Se o índice for menor que as semanas vividas → verde.
            */}
            <GridSemanas>
              {Array.from({ length: TOTAL_SEMANAS }, (_, indice) => (
                <Quadrado
                  key={indice}
                  $vivida={indice < resultado.semanasVividas}
                  title={`Semana ${indice + 1}`}
                />
              ))}
            </GridSemanas>

            <Legenda>
              <ItemLegenda>
                <QuadradoLegenda $vivida={true} />
                Semanas vividas
              </ItemLegenda>
              <ItemLegenda>
                <QuadradoLegenda $vivida={false} />
                Semanas restantes
              </ItemLegenda>
            </Legenda>
          </AreaResultado>
        )}
      </Pagina>
    </>
  )
}