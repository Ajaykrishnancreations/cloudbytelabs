import { forwardRef, useEffect, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { site, track } from "../data/site";

/** A small CSS 3D robot. `wave` lifts and waves its right hand. */
export function Bot3D({ wave = false, size = 1 }: { wave?: boolean; size?: number }) {
  return (
    <span className={`bot3d ${wave ? "is-waving" : ""}`} style={{ "--s": size } as never} aria-hidden="true">
      <span className="bot3d-antenna" />
      <span className="bot3d-head">
        <span className="bot3d-visor">
          <i />
          <i />
        </span>
        <span className="bot3d-mouth" />
      </span>
      <span className="bot3d-body" />
      <span className="bot3d-arm left" />
      <span className="bot3d-arm right">
        <span className="bot3d-hand" />
      </span>
    </span>
  );
}

const GREETED = "cloudlight-greeted";

const FloatingActions = forwardRef<HTMLButtonElement, { onOpenChat: () => void }>(function FloatingActions(
  { onOpenChat },
  ref,
) {
  const { t } = useTranslation();
  const [greet, setGreet] = useState(false);
  // Touch screens have no hover: greet once per visit after a short delay.
  useEffect(() => {
    if (!matchMedia("(hover: none)").matches) return;
    try {
      if (sessionStorage.getItem(GREETED)) return;
    } catch {
      return;
    }
    const show = window.setTimeout(() => {
      setGreet(true);
      try {
        sessionStorage.setItem(GREETED, "1");
      } catch {
        /* storage unavailable */
      }
    }, 7000);
    const hide = window.setTimeout(() => setGreet(false), 15000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);
  return (
    <div className="floating-actions">
      <div className="fab">
        <a className="float-action fab-phone" href={`tel:${site.phone}`} aria-label={t("call")} onClick={() => track("call_click")}>
          <Phone size={18} />
        </a>
        <div className="fab-card" role="tooltip">
          <span className="fab-art ring" aria-hidden="true">
            <Phone size={22} />
          </span>
          <div>
            <strong>Talk to a mentor</strong>
            <span>{site.phoneDisplay}</span>
          </div>
        </div>
      </div>
      <div className="fab">
        <a
          className="float-action whatsapp"
          href={site.whatsapp}
          aria-label={t("whatsapp")}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp_click")}
        >
          <MessageCircle size={21} />
        </a>
        <div className="fab-card" role="tooltip">
          <span className="fab-art typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong>Chat on WhatsApp</strong>
            <span>Ask about courses and batches</span>
          </div>
        </div>
      </div>
      <div className={`fab fab-bot ${greet ? "is-greeting" : ""}`}>
        <button
          ref={ref}
          className="float-action chat-trigger"
          aria-label={t("chat")}
          onClick={() => {
            setGreet(false);
            onOpenChat();
          }}
        >
          <Bot3D />
        </button>
        <div className="fab-card fab-greeter">
          <button type="button" className="fab-close" aria-label="Dismiss" onClick={() => setGreet(false)}>
            <X size={14} />
          </button>
          <span className="fab-greeter-bot">
            <Bot3D wave size={1.6} />
          </span>
          <div>
            <strong>Hi there! 👋</strong>
            <span>I'm the CloudLight assistant. Want to continue chatting here?</span>
            <div className="fab-greeter-actions">
              <button
                type="button"
                onClick={() => {
                  setGreet(false);
                  onOpenChat();
                }}
              >
                Yes, chat here
              </button>
              <a href={site.whatsapp} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_click")}>
                Use WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default FloatingActions;
