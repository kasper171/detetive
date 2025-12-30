import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Terminal, MessageSquare, Shield, AlertTriangle, Skull, Play } from "lucide-react";
import { MatrixRain } from "@/components/MatrixRain";
import { TerminalLine } from "@/components/TerminalLine";
import { useEffect, useRef } from "react";

const Home = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play video with audio when page loads
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Browser may block autoplay with audio, user needs to interact
        console.log("Autoplay blocked - user interaction required");
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 scanlines" />

      {/* Content */}
      <div className="relative z-20">
        {/* Header */}
        <header className="border-b border-primary/30 py-4 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary terminal-glow" />
              <div>
                <h1 className="text-xl font-bold text-primary terminal-glow-strong animate-flicker">
                  EQUIPE_SOMBRA
                </h1>
                <p className="text-xs text-muted-foreground">// Sistema de Exposição v2.0</p>
              </div>
            </div>
            <Link to="/conversas">
              <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Terminal className="w-4 h-4" />
                Acessar Provas
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Terminal Header */}
          <div className="bg-card/90 border border-primary/30 rounded-sm mb-8 overflow-hidden box-glow">
            <div className="bg-primary/20 px-4 py-2 border-b border-primary/30 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="ml-4 text-sm text-muted-foreground">terminal@equipesombra:~</span>
            </div>
            <div className="p-4 space-y-2">
              <TerminalLine text="Iniciando sistema de exposição..." delay={40} startDelay={500} />
              <TerminalLine text="Carregando dados do acusado..." delay={40} startDelay={2000} />
              <TerminalLine text="Acesso concedido. Exibindo informações..." delay={40} startDelay={3500} className="text-primary" />
            </div>
          </div>

          {/* Alert Banner */}
          <div className="bg-destructive/20 border-2 border-destructive rounded-sm p-4 mb-8 animate-pulse">
            <div className="flex items-center gap-3">
              <Skull className="w-6 h-6 text-destructive flex-shrink-0" />
              <h2 className="text-xl font-bold text-destructive uppercase tracking-wider">
                [!] ALERTA: NOTA DE ESCLARECIMENTO PÚBLICO
              </h2>
            </div>
          </div>

          {/* Video Section */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-3 bg-primary/20 blur-xl rounded-lg" />
              
              {/* Terminal-style container */}
              <div className="relative bg-card/90 border border-primary/50 rounded-sm overflow-hidden box-glow">
                {/* Terminal header */}
                <div className="bg-primary/20 px-3 py-1.5 border-b border-primary/30 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">playback://1337.mp4</span>
                  <Play className="w-3 h-3 text-primary ml-auto" />
                </div>
                
                {/* Video container */}
                <div className="relative">
                  <video
                    ref={videoRef}
                    src="/attachments/1337.mp4"
                    className="w-64 h-auto max-w-full"
                    controls
                    autoPlay
                    playsInline
                  />
                  
                  {/* Scanline overlay on video */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
                </div>
                
                {/* Bottom bar */}
                <div className="bg-background/80 px-3 py-1 border-t border-primary/30">
                  <p className="text-xs font-mono text-primary terminal-glow">
                    {">"} 1337_EQUIPESOMBRA
                  </p>
                </div>
              </div>
              
              {/* Corner decoration */}
              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground px-2 py-0.5 rounded-sm text-xs font-bold font-mono">
                [1337]
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-card/80 border border-primary/30 rounded-sm p-6 mb-8 box-glow">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-primary">$</span>
              <h3 className="text-lg font-bold text-primary terminal-glow">cat sobre_nos.txt</h3>
            </div>
            <div className="space-y-4 text-foreground leading-relaxed pl-4 border-l-2 border-primary/30">
              <p>
                A <span className="text-primary font-semibold terminal-glow">EQUIPE_SOMBRA</span> não compactua com práticas ilícitas, 
                fraudes ou qualquer forma de estelionato. Este documento tem como único objetivo expor publicamente 
                a conduta de um indivíduo que lesou financeiramente uma pessoa de sua própria confiança.
              </p>
              <p>
                Nosso posicionamento é claro: exigimos apenas a restituição integral do valor subtraído. 
                Não buscamos vingança, mas sim <span className="text-primary font-medium">JUSTIÇA e REPARAÇÃO</span> para a vítima.
              </p>
            </div>
          </div>

          {/* Condition Banner */}
          <div className="bg-primary/10 border border-primary rounded-sm p-6 mb-8 box-glow">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold text-primary terminal-glow">// CONDIÇÃO PARA REMOÇÃO</h3>
            </div>
            <div className="pl-4 border-l-2 border-primary">
              <p className="text-foreground leading-relaxed">
                Este website permanecerá ativo e acessível publicamente até que o valor de{" "}
                <span className="text-destructive font-bold">R$ 2.500,00</span>{" "}
                seja integralmente devolvido à vítima.
              </p>
              <p className="text-muted-foreground mt-4 font-mono text-sm">
                {">"} status: AGUARDANDO_PAGAMENTO<br />
                {">"} ação: EXPOSIÇÃO_ATIVA<br />
                {">"} condição: site_offline = pagamento_confirmado
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-destructive/20 blur-xl" />
              <img
                src="/images/acusado.png"
                alt="Foto do acusado"
                className="relative w-72 h-auto rounded-sm border-2 border-destructive shadow-lg shadow-destructive/50"
              />
              <div className="absolute -top-4 -right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-sm text-sm font-bold font-mono animate-pulse">
                [ACUSADO]
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background border border-destructive px-4 py-1 rounded-sm">
                <span className="text-destructive font-mono text-sm">ID: LADRÃO_001</span>
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-card/80 border border-primary/30 rounded-sm p-6 space-y-6 box-glow mt-12">
            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-primary">$</span>
                <h3 className="text-lg font-bold text-destructive">cat descricao_fatos.log</h3>
              </div>
              <div className="pl-4 border-l-2 border-destructive/50 space-y-4 text-foreground">
                <p>
                  O indivíduo identificado abaixo apropriou-se indevidamente da quantia de{" "}
                  <span className="text-destructive font-bold">R$ 2.500,00</span> durante uma dinâmica 
                  conhecida como "Dança das Cadeiras".
                </p>
                <p>
                  O mesmo declarou ter efetuado o pagamento via PIX, apresentando um comprovante que 
                  posteriormente foi identificado como <span className="text-destructive font-bold">[FRAUDULENTO]</span>.
                </p>
                <p>
                  Todas as documentações apresentadas pelo acusado são <span className="text-destructive">FALSIFICADAS</span>. 
                  O mesmo vem tentando manipular terceiros com narrativas inverídicas.
                </p>
              </div>
            </div>

            {/* Accused Data */}
            <div className="bg-destructive/10 border border-destructive/50 rounded-sm p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-bold text-destructive font-mono">DADOS_ACUSADO.json</h3>
              </div>
              <pre className="text-sm text-foreground font-mono bg-background/50 p-4 rounded-sm overflow-x-auto">
{`{
  "nickname": "Detetive",
  "nome_completo": "Endrel Souza Segundo Dos Santos",
  "status": "DEVEDOR",
  "valor_devido": "R$ 2.500,00",
  "localização": "Portugal",
  "condição_financeira": "ESTÁVEL",
  "motivo_não_pagar": "FALTA_DE_CARÁTER"
}`}
              </pre>
            </div>

            {/* Consequences */}
            <div className="bg-muted/30 border border-border rounded-sm p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-primary">$</span>
                <h3 className="text-lg font-bold text-primary font-mono">./aplicar_consequencias.sh</h3>
              </div>
              <div className="font-mono text-sm space-y-2 text-foreground">
                <p className="text-primary">[✓] Discord: BANIDO_PERMANENTEMENTE</p>
                <p className="text-primary">[✓] Habbo: BANIDO_10_ANOS</p>
                <p className="text-destructive">[●] Exposição: EM_ANDAMENTO...</p>
              </div>
            </div>

            {/* Character Analysis */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-primary">$</span>
                <h3 className="text-lg font-bold text-primary">cat analise_carater.txt</h3>
              </div>
              <div className="pl-4 border-l-2 border-primary/50 space-y-4 text-muted-foreground">
                <p>
                  O acusado possui recursos financeiros disponíveis, realizando transferências PIX 
                  para custear despesas pessoais. Isso evidencia que a recusa em pagar se deve à{" "}
                  <span className="text-destructive font-semibold">MÁ-FÉ e AUSÊNCIA TOTAL DE CARÁTER</span>.
                </p>
                <p>
                  Um indivíduo que rouba o próprio amigo é capaz de qualquer coisa e 
                  <span className="text-destructive"> NÃO MERECE A CONFIANÇA DE NINGUÉM</span>.
                </p>
              </div>
            </div>

            {/* Final Statement */}
            <div className="text-center py-6 border-t border-primary/30">
              <div className="bg-background/50 p-4 rounded-sm inline-block">
                <p className="text-lg font-bold text-destructive font-mono mb-2">
                  [!] AVISO FINAL
                </p>
                <p className="text-foreground max-w-lg mx-auto">
                  O indivíduo supracitado é um estelionatário. Não se deixem manipular. 
                  As provas estão documentadas e disponíveis.
                </p>
              </div>
            </div>

            {/* Signature */}
            <div className="text-right text-muted-foreground font-mono text-sm">
              <p>---</p>
              <p className="text-primary terminal-glow">EQUIPE_SOMBRA</p>
              <p>// 2025</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <Link to="/conversas">
              <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/80 font-mono box-glow">
                <MessageSquare className="w-5 h-5" />
                {">"} ACESSAR_PROVAS.exe
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-primary/30 py-4 mt-12 bg-background/80">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm font-mono">
            <p>© 2025 EQUIPE_SOMBRA // JUSTIÇA_E_TRANSPARÊNCIA</p>
            <p className="text-xs mt-1 text-primary/50">root@sombra:~# sistema_ativo</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
