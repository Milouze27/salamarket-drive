import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Info,
  Store,
  Volume2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { BRAND } from "@/config/brand";

const STORAGE_ENABLED = "sound_enabled";
const STORAGE_VOLUME = "sound_volume";
const DEFAULT_VOLUME = 0.7;
const APP_VERSION = "1.0.0";

const readSoundEnabled = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_ENABLED) === "true";
  } catch {
    return false;
  }
};

const readVolume = (): number => {
  try {
    const raw = localStorage.getItem(STORAGE_VOLUME);
    if (!raw) return DEFAULT_VOLUME;
    const value = Number(raw);
    if (!Number.isFinite(value)) return DEFAULT_VOLUME;
    return Math.max(0, Math.min(1, value));
  } catch {
    return DEFAULT_VOLUME;
  }
};

const AdminSettings = () => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(DEFAULT_VOLUME);

  // Charge les préférences au mount
  useEffect(() => {
    setSoundEnabled(readSoundEnabled());
    setVolume(readVolume());
  }, []);

  const handleSoundToggle = (next: boolean) => {
    setSoundEnabled(next);
    try {
      localStorage.setItem(STORAGE_ENABLED, String(next));
    } catch {
      // ignore
    }
  };

  const handleVolumeChange = ([next]: number[]) => {
    const value = Math.max(0, Math.min(1, next / 100));
    setVolume(value);
    try {
      localStorage.setItem(STORAGE_VOLUME, String(value));
    } catch {
      // ignore
    }
  };

  const testSound = () => {
    const audio = new Audio("/sounds/cha-ching.mp3");
    audio.volume = volume;
    audio.play().catch(() => {
      toast.error("Impossible de lire le son", {
        description: "Vérifiez les permissions audio du navigateur.",
      });
    });
  };

  return (
    <div
      className="min-h-dvh bg-[#FAFAFA]"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">Réglages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Personnalisez votre tableau de bord
          </p>
        </header>

        {/* Section 1 — Notifications sonores */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0F4C3A]/10 flex items-center justify-center shrink-0">
              <Bell size={20} className="text-[#0F4C3A]" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">
                Notifications sonores
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Recevez une alerte audio à chaque nouvelle commande
              </p>

              {/* Toggle ON/OFF */}
              <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-900">
                  Activer le son
                </span>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                  aria-label="Activer les notifications sonores"
                />
              </div>

              {/* Slider volume (visible si activé) */}
              {soundEnabled && (
                <div className="py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Volume
                    </span>
                    <span className="text-sm text-gray-500 font-mono tabular-nums">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[Math.round(volume * 100)]}
                    onValueChange={handleVolumeChange}
                    min={0}
                    max={100}
                    step={5}
                    aria-label="Volume des notifications"
                  />
                </div>
              )}

              {/* Bouton test */}
              <button
                type="button"
                onClick={testSound}
                disabled={!soundEnabled}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C3A] text-white text-sm font-medium rounded-lg hover:bg-[#0A3A2C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Volume2 size={16} />
                Tester le son
              </button>
            </div>
          </div>
        </section>

        {/* Section 2 — Informations magasin */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0F4C3A]/10 flex items-center justify-center shrink-0">
              <Store size={20} className="text-[#0F4C3A]" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">
                Informations du magasin
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Détails de votre point de vente
              </p>

              <div className="mt-4 space-y-3">
                <div className="py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Nom
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {BRAND.store.name}
                  </p>
                </div>
                <div className="py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Adresse
                  </p>
                  <p className="text-sm font-medium text-gray-400 mt-1 italic">
                    [Adresse à remplir par le gérant]
                  </p>
                </div>
                <div className="py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Téléphone
                  </p>
                  <p className="text-sm font-medium text-gray-400 mt-1 italic">
                    [Numéro à remplir par le gérant]
                  </p>
                </div>
                <div className="py-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Horaires
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    Lun – Sam : 8h – 20h
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Dim : 9h – 13h
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4 italic">
                L'édition de ces informations sera disponible prochainement.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 — À propos */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#0F4C3A]/10 flex items-center justify-center shrink-0">
              <Info size={20} className="text-[#0F4C3A]" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">
                À propos
              </h2>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Version</span>
                  <span className="text-gray-900 font-mono">{APP_VERSION}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Dernière mise à jour</span>
                  <span className="text-gray-900">
                    {format(new Date(), "dd MMM yyyy", { locale: fr })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
