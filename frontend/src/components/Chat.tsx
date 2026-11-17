import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Phone,
  Send,
  X,
  RotateCcw,
  Minus,
  Bot,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { site, track } from "../data/site";
type Message = { role: "user" | "assistant"; content: string };
export default function Chat() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages, loading, open]);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    if (!open) return;
    field.current?.focus();
    const mobile = matchMedia("(max-width:767px)").matches;
    const previous = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = panel.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),a,input:not(:disabled)",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", key);
    };
  }, [open]);
  async function send(text = input) {
    if (!text.trim() || loading) return;
    const history = messages.slice(-12);
    setMessages((m) => [...m, { role: "user", content: text.trim() }]);
    setInput("");
    setLoading(true);
    setError(false);
    track("chat_message");
    const controller = new AbortController();
    abort.current = controller;
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          language: i18n.language,
        }),
        signal: controller.signal,
      });
      if (!r.ok) throw new Error("Chat unavailable");
      const data = await r.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setError(true);
    } finally {
      clearTimeout(timer);
      setLoading(false);
      field.current?.focus();
    }
  }
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <>
      {!open && (
        <div className="floating-actions">
          <a
            className="float-action"
            href={`tel:${site.phone}`}
            aria-label={t("call")}
            title={t("call")}
            onClick={() => track("call_click")}
          >
            <Phone size={18} />
          </a>
          <a
            className="float-action whatsapp"
            href={site.whatsapp}
            aria-label={t("whatsapp")}
            title={t("whatsapp")}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("whatsapp_click")}
          >
            <MessageCircle size={21} />
          </a>
          <button
            ref={trigger}
            className="float-action chat-trigger"
            aria-label={t("chat")}
            onClick={() => {
              setOpen(true);
              track("chat_open");
            }}
          >
            <Bot size={25} />
          </button>
        </div>
      )}
      {open && (
        <div
          ref={panel}
          className="chat-panel"
          role="dialog"
          aria-modal="true"
          aria-label={t("assistant")}
        >
          <div className="chat-header">
            <span className="chat-brand" aria-hidden="true">
              <img src="/brand/cloudlight-mark-128.webp" alt="" />
            </span>
            <div>
              <strong>{t("assistant")}</strong>
              <small>{t("chatOffline")}</small>
            </div>
            <div>
              <button
                className="icon-button"
                aria-label={t("clear")}
                disabled={loading}
                onClick={() => {
                  setMessages([]);
                  setError(false);
                }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                className="icon-button"
                aria-label="Minimise"
                onClick={close}
              >
                <Minus size={18} />
              </button>
              <button
                className="icon-button"
                aria-label={t("close")}
                onClick={close}
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="chat-messages" role="log" aria-live="polite">
            <div className="chat-bubble">{t("assistantWelcome")}</div>
            {messages.map((m, i) => (
              <div className={`chat-bubble ${m.role}`} key={i}>
                {m.content}
              </div>
            ))}
            {!messages.length && (
              <div className="chat-suggestions">
                {["Salesforce", "MERN Stack", "UI/UX", "Python"].map((x) => (
                  <button key={x} onClick={() => send(x)}>
                    {x}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <p className="chat-bubble" role="status">
                {t("thinking")}
              </p>
            )}
            {error && (
              <div role="alert">
                <p className="chat-bubble">{t("chatError")}</p>
                <div className="chat-contact">
                  <a href={site.whatsapp} target="_blank" rel="noreferrer">
                    {t("whatsapp")}
                  </a>
                  <a href={`tel:${site.phone}`}>{t("call")}</a>
                </div>
              </div>
            )}
            <div ref={end} />
          </div>
          <form
            className="chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1500}
              aria-label={t("chatPlaceholder")}
              placeholder={t("chatPlaceholder")}
              autoComplete="off"
            />
            <button
              disabled={loading || !input.trim()}
              type="submit"
              aria-label={t("chatSend")}
            >
              <Send size={19} />
            </button>
          </form>
          <p className="chat-note">{t("fees")}</p>
        </div>
      )}
    </>
  );
}
