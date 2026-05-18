from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import HTMLResponse, StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from typing import List, Optional

from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # libera qualquer site (necessário pro seu caso)
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/stream")
async def options_stream():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET",
        }
    )

# fila de eventos (simula comunicação do proxy/IA)
connections = {}
# correlaciona um navId (emitido pelo mitmproxy por carregamento) à mesma fila do SSE
nav_connections = {}
# controla streams ativos por (clientId, tabId, navId)
active_streams: dict[tuple[str, str, str], int] = {}
# Mensagens recebidas antes do browser abrir o EventSource (evita gate preso em corrida)
_PENDING_NAV_MAX = 32
pending_nav_messages: dict[str, list[str]] = {}


def _buffer_nav_message(nav_id: str, data: str) -> None:
    if not nav_id:
        return
    bucket = pending_nav_messages.setdefault(nav_id, [])
    if len(bucket) >= _PENDING_NAV_MAX:
        bucket.pop(0)
    bucket.append(data)


async def _drain_pending_to_queue(nav_id: str, queue: asyncio.Queue) -> None:
    for msg in pending_nav_messages.pop(nav_id, []):
        await queue.put(msg)

@app.get("/")
def home():
    html = """
    <html>
        <head>
            <style>

                .blurred {
                    filter: blur(6px);
                    pointer-events: none;
                    user-select: none;
                }

                .overlay {
                    position: fixed;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    background: rgba(0,0,0,0.6);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    z-index:9999;
                }

                .popup {
                    background:white;
                    padding:30px;
                    border-radius:10px;
                    font-family:Arial;
                    max-width:400px;
                    text-align:center;
                }

                button {
                    margin-top:20px;
                    padding:10px 20px;
                    cursor:pointer;
                }

                .redacted {
                    display: inline-block;
                    background: #eceff3;
                    color: #3b4350;
                    padding: 2px 10px;
                    border-radius: 999px;
                    border: 1px solid #d7dde6;
                    font-weight: 600;
                    line-height: 1.25;
                }

            </style>
        </head>

        <body>

            <div id="conteudo">
                <h1>Página Normal</h1>

                <p>
                    Esta página possui uma frase sensível que poderá ser bloqueada
                    dinamicamente pelo servidor.
                </p>
            </div>

          <script>

    console.log("🔌 Iniciando conexão com SSE...");

    // 🔑 clientId (persistente)
    const clientId = localStorage.getItem("clientId") || crypto.randomUUID();
    localStorage.setItem("clientId", clientId);
    
    // 🔑 tabId (único por aba)
    const tabId = sessionStorage.getItem("tabId") || crypto.randomUUID();
    sessionStorage.setItem("tabId", tabId);
    
    const navId = window.__RESIST_NAV_ID__

    console.log("🆔 clientId:", clientId);
    console.log("🧩 tabId:", tabId);
    console.log("%c🧭 navId (demo page — mitm usa o UUID do log)", "font-weight:bold;color:#22c55e", navId);
    
    /* VERIFY_GATE desativado — descomente para voltar o overlay "Verificando conteúdo..."
    // VERIFY_GATE_START (remova este bloco para desativar gate)
    function createVerifyGate() {
        if (document.getElementById("verify-gate-overlay")) return;
        if (document.body) {
            document.body.style.visibility = "hidden";
        }
        const gate = document.createElement("div");
        gate.id = "verify-gate-overlay";
        gate.style.position = "fixed";
        gate.style.inset = "0";
        gate.style.background = "#0f172a";
        gate.style.color = "#fff";
        gate.style.zIndex = "2147483646";
        gate.style.display = "flex";
        gate.style.alignItems = "center";
        gate.style.justifyContent = "center";
        gate.style.fontFamily = "Arial, sans-serif";
        gate.innerHTML = '<div style="text-align:center;"><h3 style="margin:0 0 8px 0;">Verificando conteúdo...</h3><p style="margin:0;">Aguarde alguns instantes.</p></div>';
        document.documentElement.appendChild(gate);
    }
    function releaseVerifyGate() {
        const gate = document.getElementById("verify-gate-overlay");
        if (gate) gate.remove();
        if (document.body) {
            document.body.style.visibility = "visible";
        }
    }
    createVerifyGate();
    // VERIFY_GATE_END
    setTimeout(function () {
        if (document.getElementById("verify-gate-overlay")) {
            console.warn("⏱️ VERIFY_GATE: timeout — liberando overlay por segurança");
            releaseVerifyGate();
        }
    }, 90000);
    */

    // Sempre definido: libera gate quando main envia verification_done (páginas sem frase ofensiva).
    function releaseVerifyGate() {
        const gate = document.getElementById("verify-gate-overlay");
        if (gate) gate.remove();
        if (document.body) {
            document.body.style.visibility = "visible";
        }
    }

    // 🚀 conecta no SSE (navId alinha com o fluxo do mitmproxy / logs)
    //const navId = window.__RESIST_NAV_ID__;

    if (!navId) {
        console.error("❌ navId não definido (mitm ainda não injetou)");
    }

    const url = `https://ssenovo-production.up.railway.app/stream?clientId=${encodeURIComponent(clientId)}&tabId=${encodeURIComponent(tabId)}&navId=${encodeURIComponent(navId)}`;
        
    console.log("[Resist SSE] EventSource URL:", url);
    const evtSource = new EventSource(url);

    // ✅ conexão aberta
    evtSource.onopen = function () {
        console.log("✅ Conectado ao SSE com sucesso!");
    };

    // 📩 mensagem recebida
    evtSource.onmessage = function (event) {

        console.log("📩 Evento bruto recebido:", event.data);

        if (!event.data || event.data.trim() === "") {
            console.log("💓 Heartbeat recebido (keep-alive)");
            return;
        }

        try {
            const data = JSON.parse(event.data);

            console.log("📦 JSON parseado:", data);

            if (data.type === "highlight") {
                console.log("🚨 Highlight acionado com frases:", data.texts);
                try {
                    bloquearMultiplasFrases(data.texts);
                    aplicarBlurPopup(data.motivos || []);
                } catch (e) {
                    console.error("❌ Erro no highlight:", e);
                }
                releaseVerifyGate();
            }

            if (data.type === "verification_done") {
                console.log("✅ Verificação concluída.");
                releaseVerifyGate();
            }

        } catch (err) {
            console.error("❌ Erro ao fazer parse do JSON:", err);
        }
    };

    // ❌ erro geral
    evtSource.onerror = function (err) {
        console.error("❌ Erro na conexão SSE:", err);

        if (evtSource.readyState === EventSource.CLOSED) {
            console.error("🔴 Conexão SSE foi fechada");
        } else if (evtSource.readyState === EventSource.CONNECTING) {
            console.warn("🟡 Tentando reconectar ao SSE...");
        }
    };



    function bloquearMultiplasFrases(frases) {

    console.log("🔍 Iniciando bloqueio de frases...");

    const root = document.getElementById("conteudo");

    if (!root) {
        console.warn("⚠️ #conteudo não encontrado, usando document.body");
    }

    const target = root || document.body;

    function removerLink(anchorEl) {
        if (!anchorEl || !anchorEl.parentNode) return;
        const parent = anchorEl.parentNode;
        while (anchorEl.firstChild) {
            parent.insertBefore(anchorEl.firstChild, anchorEl);
        }
        parent.removeChild(anchorEl);
    }

    function shouldSkipTextNode(node) {
        const p = node.parentElement;
        if (!p) return true;
        if (p.closest && p.closest(".redacted")) return true;
        const tag = p.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return true;
        return false;
    }

    function collectRenderableTextNodes(rootEl) {
        const out = [];
        const walker = document.createTreeWalker(
            rootEl,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        let n;
        while (n = walker.nextNode()) {
            if (shouldSkipTextNode(n)) continue;
            out.push(n);
        }
        return out;
    }

    function findCrossNodeMatch(rootEl, needle) {
        const needleNorm = String(needle || "").trim();
        if (needleNorm.length < 2) return null;
        const nodes = collectRenderableTextNodes(rootEl);
        let haystack = "";
        const starts = [];
        for (let i = 0; i < nodes.length; i++) {
            starts.push(haystack.length);
            haystack += nodes[i].nodeValue;
        }
        const idx = haystack.indexOf(needleNorm);
        if (idx === -1) return null;
        const endPos = idx + needleNorm.length;
        let si = -1, so = 0, ei = -1, eo = 0;
        for (let i = 0; i < nodes.length; i++) {
            const b = starts[i];
            const len = nodes[i].nodeValue.length;
            const nodeEnd = b + len;
            if (si < 0 && idx < nodeEnd) {
                si = i;
                so = idx - b;
            }
            if (endPos <= nodeEnd) {
                ei = i;
                eo = endPos - b;
                break;
            }
        }
        if (si < 0 || ei < 0) return null;
        return {
            startNode: nodes[si],
            startOffset: so,
            endNode: nodes[ei],
            endOffset: eo,
        };
    }

    function redactCrossNodeOccurrences(rootEl, needle) {
        const needleNorm = String(needle || "").trim();
        if (needleNorm.length < 2) return;
        let guard = 200;
        while (guard-- > 0) {
            const loc = findCrossNodeMatch(rootEl, needleNorm);
            if (!loc) break;
            const range = document.createRange();
            try {
                range.setStart(loc.startNode, loc.startOffset);
                range.setEnd(loc.endNode, loc.endOffset);
            } catch (e) {
                console.warn("[Resist] Range inválido (DOM mudou):", e);
                break;
            }
            const sc = range.startContainer;
            const ec = range.endContainer;
            const a1 = (sc.nodeType === 1 ? sc : sc.parentElement);
            const a2 = (ec.nodeType === 1 ? ec : ec.parentElement);
            const anchorStart = a1 && a1.closest ? a1.closest("a") : null;
            const anchorEnd = a2 && a2.closest ? a2.closest("a") : null;

            console.log("🚫 Frase (cross-node) encontrada:", needleNorm.slice(0, 80) + (needleNorm.length > 80 ? "…" : ""));
            range.deleteContents();
            const mark = document.createElement("span");
            mark.className = "redacted";
            mark.textContent = "[redacted]";
            range.insertNode(mark);
            if (anchorStart && anchorStart === anchorEnd) {
                console.log("🔗 Link removido (trecho inteiro dentro de um <a>)");
                removerLink(anchorStart);
            }
        }
    }

    function redactSingleNodeFallback(rootEl, frase) {
        const walker = document.createTreeWalker(
            rootEl,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        let node;
        while (node = walker.nextNode()) {
            if (shouldSkipTextNode(node)) continue;
            const texto = node.nodeValue;
            if (!texto.includes(frase)) continue;
            console.log("🚫 Frase (single-node) encontrada:", frase.slice(0, 80) + (frase.length > 80 ? "…" : ""));
            const anchor = node.parentElement?.closest ? node.parentElement.closest("a") : null;
            const partes = texto.split(frase);
            const fragment = document.createDocumentFragment();
            partes.forEach((parte, index) => {
                fragment.appendChild(document.createTextNode(parte));
                if (index < partes.length - 1) {
                    const span = document.createElement("span");
                    span.className = "redacted";
                    span.textContent = "[redacted]";
                    fragment.appendChild(span);
                }
            });
            node.parentNode.replaceChild(fragment, node);
            if (anchor) {
                console.log("🔗 Link removido por conter frase censurada");
                removerLink(anchor);
            }
        }
    }

    const ordered = [...frases]
        .map((f) => String(f || "").trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);

    ordered.forEach((frase) => {
        console.log("➡️ Procurando frase:", frase.slice(0, 120) + (frase.length > 120 ? "…" : ""));
        redactCrossNodeOccurrences(target, frase);
        redactSingleNodeFallback(target, frase);
    });

    console.log("✅ Bloqueio concluído");
}



    function traduzirMotivo(motivo) {
        const m = String(motivo || "").toLowerCase();
        if (m === "gender") return "Genero";
        if (m === "race") return "Racial";
        if (m === "religion") return "Religiao";
        if (m === "lgbtqphobia") return "LGBTQfobia";
        if (m === "xenophobia") return "Xenofobia";
        return motivo || "Nao informado";
    }
    
    function getSiteUrlForQr() {
        const params = new URLSearchParams(window.location.search);
        const rawSite = params.get("site");
        if (rawSite) {
            try {
                return decodeURIComponent(rawSite);
            } catch (e) {
                return rawSite;
            }
        }
        return window.location.href;
    }

    function aplicarBlurPopup(motivos) {

        console.log("🌀 Aplicando blur + popup");

        const conteudo = document.getElementById("conteudo") || document.body;

        conteudo.classList.add("blurred");
        
        const overlay = document.createElement("div");
        overlay.className = "overlay";

        const popup = document.createElement("div");
        popup.className = "popup";

        const motivosValidos = Array.isArray(motivos) ? motivos.filter(Boolean) : [];
        const siteUrl = getSiteUrlForQr();
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(siteUrl)}`;
        const motivoHtml = motivosValidos.length
            ? `<p><strong>Motivos detectados:</strong> ${motivosValidos.map(traduzirMotivo).join(", ")}</p>`
            : `<p><strong>Motivo detectado:</strong> Nao informado</p>`;

        popup.innerHTML = `
            <h2>Conteudo bloqueado</h2>
            <div style="display:flex; gap:16px; align-items:center; text-align:left; margin-top:12px;">
                <div style="flex:0 0 170px; display:flex; flex-direction:column; align-items:center; gap:8px;">
                    <p style="font-size:13px; margin:0; text-align:center;">
                        Leia o <strong>QR Code</strong> em nosso aplicativo para sugerir desbloqueio.
                    </p>
                    <img
                        src="${qrCodeUrl}"
                        alt="QR Code do site"
                        style="width:160px; height:160px; border:1px solid #ddd; border-radius:8px;"
                    />
                </div>
                <div style="flex:1; min-width:0;">
                    <p>Algumas palavras foram ocultadas automaticamente.</p>
                    ${motivoHtml}
                    <p style="word-break:break-all; font-size:12px;"><strong>Site:</strong> ${siteUrl}</p>
                </div>
            </div>
            <button id="fechar">Entendi</button>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        document.getElementById("fechar").onclick = () => {
            console.log("🟢 Usuário fechou o popup");

            overlay.remove();
            document.getElementById("conteudo").classList.remove("blurred");
        };
    }

</script>

        </body>
    </html>
    """
    return HTMLResponse(html)


@app.get("/stream")
async def stream(
    request: Request,
    clientId: str,
    tabId: str,
    navId: Optional[str] = None,
):
    nav_key = navId or "-"
    stream_key = (clientId, tabId, nav_key)
    active_streams[stream_key] = active_streams.get(stream_key, 0) + 1

    if clientId not in connections:
        connections[clientId] = {}

    if tabId not in connections[clientId]:
        connections[clientId][tabId] = asyncio.Queue()

    queue = connections[clientId][tabId]
    if navId:
        nav_connections[navId] = queue
        await _drain_pending_to_queue(navId, queue)
        print(f"🟢 SSE stream navId registrado (POST /send-to-nav usa este id): {navId}")
    print(
        f"🟢 Conectado: client={clientId} tab={tabId} nav={navId or '-'} "
        f"| ativos={active_streams.get(stream_key, 0)}"
    )

    async def event_generator():
        try:
            yield "retry: 300\n\n"
            ack = json.dumps({
                "type": "stream_ack",
                "navId": navId,
                "clientId": clientId,
                "tabId": tabId,
            })
            print(f"📡 stream_ack enviado: navId={navId or '-'} client={clientId} tab={tabId}")
            yield f"data: {ack}\n\n"
            yield ":\n\n"

            while True:
                try:
                    data = await asyncio.wait_for(queue.get(), timeout=5)
                    print(f"📡 stream data enviado para navId={navId or '-'}: {data[:140]}")
                    yield f"data: {data}\n\n"
                except asyncio.TimeoutError:
                    yield ":\n\n"  # heartbeat
                except Exception as e:
                    print("❌ Erro no stream:", str(e))
                    break

        finally:
            # Evita corrida: só remove mapeamentos quando for o último stream ativo da chave
            remaining = max(active_streams.get(stream_key, 1) - 1, 0)
            if remaining == 0:
                active_streams.pop(stream_key, None)
            else:
                active_streams[stream_key] = remaining

            print(
                f"🔴 Desconectado: {clientId} | {tabId} | nav={navId or '-'} "
                f"| ativos_restantes={remaining}"
            )

            if remaining == 0:
                if navId and nav_connections.get(navId) is queue:
                    nav_connections.pop(navId, None)
                if connections.get(clientId, {}).get(tabId) is queue:
                    connections.get(clientId, {}).pop(tabId, None)
                if clientId in connections and not connections[clientId]:
                    connections.pop(clientId)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            # Evita compressao/interferencia de proxy em stream SSE.
            "Content-Encoding": "identity",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET",
        }
    )



# 🔥 simula o PROXY/IA terminando o processamento

@app.post("/proxy-result")
async def proxy_result(frases: List[str]):

    payload = {
        "type": "highlight",
        "texts": frases
    }

    data = json.dumps(payload)

    print("📡 Broadcast para todos")

    for client in connections.values():
        for queue in client.values():
            await queue.put(data)

    return {"status": "broadcast sent"}

@app.post("/send-to-client")
async def send_to_client(clientId: str, frases: List[str]):

    payload = {
        "type": "highlight",
        "texts": frases
    }

    data = json.dumps(payload)

    if clientId in connections:
        for queue in connections[clientId].values():
            await queue.put(data)

    return {"status": "sent to client"}

@app.post("/send-to-tab")
async def send_to_tab(clientId: str, tabId: str, frases: List[str]):

    payload = {
        "type": "highlight",
        "texts": frases
    }

    data = json.dumps(payload)

    if clientId in connections:
        if tabId in connections[clientId]:
            await connections[clientId][tabId].put(data)

    return {"status": "sent to tab"}


class SendToNavBody(BaseModel):
    """Corpo JSON para o worker (main) — evita limite de tamanho de query string nas frases."""
    navId: str
    frases: List[str] = []
    motivos: List[str] = []


@app.post("/send-to-nav")
async def send_to_nav(body: SendToNavBody):
    """Envia highlight só para o SSE que registrou esse navId (ex.: mesmo id do log do mitmproxy)."""
    if not body.frases:
        return {"status": "ignored", "reason": "empty frases", "navId": body.navId}

    payload = {
        "type": "highlight",
        "texts": body.frases,
        "motivos": body.motivos,
    }
    data = json.dumps(payload)

    queue = nav_connections.get(body.navId)
    if queue is None:
        _buffer_nav_message(body.navId, data)
        print(f"📤 send-to-nav BUFFERED (browser ainda não abriu /stream): navId={body.navId}")
        return {"status": "buffered until stream connects", "navId": body.navId}

    await queue.put(data)
    print(f"📤 send-to-nav entregue na fila SSE: navId={body.navId} frases={len(body.frases)}")
    return {"status": "sent to nav", "navId": body.navId}


class SendStatusToNavBody(BaseModel):
    navId: str
    verified: bool = True
    bloqueado: bool = False


@app.post("/send-status-to-nav")
async def send_status_to_nav(body: SendStatusToNavBody):
    payload = {
        "type": "verification_done",
        "verified": body.verified,
        "bloqueado": body.bloqueado,
    }
    data = json.dumps(payload)

    queue = nav_connections.get(body.navId)
    if queue is None:
        _buffer_nav_message(body.navId, data)
        print(f"📤 send-status-to-nav BUFFERED: navId={body.navId}")
        return {"status": "buffered until stream connects", "navId": body.navId}

    await queue.put(data)
    print(f"📤 send-status-to-nav entregue: navId={body.navId}")
    return {"status": "status sent to nav", "navId": body.navId}