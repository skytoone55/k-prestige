'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PublicNavigation } from '@/components/layout/PublicNavigation';
import { Footer } from '@/components/layout/Footer';
import { PhoneInput } from '@/components/ui/PhoneInput';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Users,
  Bus,
  UserCheck,
  Utensils,
  MessageSquare,
  Loader2,
  CheckCircle,
  Upload,
  X,
  File as FileIcon,
  Plane,
  Calendar,
  Clock,
  Copy,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MONDAY_LABELS } from '@/lib/monday-config';

// Types
interface Participant {
  nom: string;
  dateNaissance: string;
  passportUrl?: string;
  passportFileName?: string;
}

interface FormData {
  nomPrenom: string;
  telephone: string;
  email: string;
  nbAdultes: number;
  nbBebe: number;
  nbEnfants3ans: number;
  nbEnfants4a6: number;
  nbEnfants7a11: number;
  numDevis: string;
  navetteChoix: string;
  dateArrivee: string;
  heureArrivee: string;
  volArrivee: string;
  dateRetour: string;
  heureDepart: string;
  volDepart: string;
  nbPersonnesTotal: string;
  participants: Participant[];
  questionnaireOuiNon: string;
  preferenceAlimentaire: number[];
  autrePreciser: string;
  salades: number[];
  preferenceAlcool: number[];
  carteVins: string;
  famillesTable: string;
  infosComplementaires: string;
  passportUrls: string[];
}

const initialFormData: FormData = {
  nomPrenom: '',
  telephone: '',
  email: '',
  nbAdultes: 0,
  nbBebe: 0,
  nbEnfants3ans: 0,
  nbEnfants4a6: 0,
  nbEnfants7a11: 0,
  numDevis: '',
  navetteChoix: '',
  dateArrivee: '',
  heureArrivee: '',
  volArrivee: '',
  dateRetour: '',
  heureDepart: '',
  volDepart: '',
  nbPersonnesTotal: '1',
  participants: [{ nom: '', dateNaissance: '', passportUrl: '', passportFileName: '' }],
  questionnaireOuiNon: '',
  preferenceAlimentaire: [],
  autrePreciser: '',
  salades: [],
  preferenceAlcool: [],
  carteVins: '',
  famillesTable: '',
  infosComplementaires: '',
  passportUrls: [],
};

const STEPS = [
  { id: 1, title: 'Contacto', shortTitle: 'Contacto', icon: User },
  { id: 2, title: 'Grupo', shortTitle: 'Grupo', icon: Users },
  { id: 3, title: 'Traslados', shortTitle: 'Traslados', icon: Bus },
  { id: 4, title: 'Viajeros', shortTitle: 'Viajeros', icon: UserCheck },
  { id: 5, title: 'Comidas', shortTitle: 'Comidas', icon: Utensils },
  { id: 6, title: 'Info', shortTitle: 'Info', icon: MessageSquare },
  { id: 7, title: 'Resumen', shortTitle: 'Resumen', icon: CheckCircle },
];

// Labels en espagnol pour les options de navette
const NAVETTE_OPTIONS_ES = [
  { value: '0', label: 'Traslado llegada únicamente' },
  { value: '1', label: 'Traslado salida únicamente' },
  { value: '2', label: 'Traslado llegada + salida' },
  { value: '3', label: 'No necesito traslado' },
];

// Validation email simple
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Composant Input stylisé
function StyledInput({
  label,
  required,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-[#C9A227]">*</span>}
        </label>
      )}
      <input
        {...props}
        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]
                   transition-all duration-200 text-gray-800 placeholder:text-gray-400"
      />
    </div>
  );
}

export default function InscriptionContentES() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Système de dossier
  const [dossierCode, setDossierCode] = useState<string | null>(null);
  const [mondayItemId, setMondayItemId] = useState<string | null>(null);
  const [isLoadingDossier, setIsLoadingDossier] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeCode, setResumeCode] = useState('');
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Créer un nouveau dossier après l'étape 1
  const createDossier = useCallback(async () => {
    if (dossierCode) return;

    try {
      const response = await fetch('/api/inscription/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          formData,
          currentStep,
          email: formData.email,
          telephone: formData.telephone,
          nomPrenom: formData.nomPrenom,
          lang: 'es',
        }),
      });
      const result = await response.json();
      if (result.success) {
        setDossierCode(result.code);
        if (result.mondayItemId) {
          setMondayItemId(result.mondayItemId);
        }
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Error al crear el expediente:', err);
    }
  }, [dossierCode, formData, currentStep]);

  // Sauvegarder le dossier
  const saveDossier = useCallback(async () => {
    if (!dossierCode) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/inscription/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          code: dossierCode,
          mondayItemId,
          formData,
          currentStep,
          email: formData.email,
          telephone: formData.telephone,
          nomPrenom: formData.nomPrenom,
          lang: 'es',
        }),
      });
      const result = await response.json();
      if (result.mondayItemId && !mondayItemId) {
        setMondayItemId(result.mondayItemId);
      }
      setLastSaved(new Date());
    } catch (err) {
      console.error('Error al guardar:', err);
    } finally {
      setIsSaving(false);
    }
  }, [dossierCode, mondayItemId, formData, currentStep]);

  // Sauvegarde automatique quand on change d'étape
  useEffect(() => {
    if (dossierCode && currentStep > 1) {
      saveDossier();
    }
  }, [currentStep, dossierCode, saveDossier]);

  // Reprendre un dossier existant
  const resumeDossier = async () => {
    if (!resumeCode.trim()) {
      setResumeError('Por favor, introduzca un código de expediente');
      return;
    }

    setIsLoadingDossier(true);
    setResumeError(null);

    try {
      const response = await fetch(`/api/inscription/draft?code=${resumeCode.toUpperCase()}`);
      const result = await response.json();

      if (result.success) {
        setDossierCode(result.code);
        if (result.mondayItemId) {
          setMondayItemId(result.mondayItemId);
        }
        setFormData(result.formData);
        setCurrentStep(result.currentStep || 1);
        setShowResumeModal(false);
        setHasStarted(true);
      } else {
        setResumeError(result.error || 'Expediente no encontrado');
      }
    } catch {
      setResumeError('Error de conexión');
    } finally {
      setIsLoadingDossier(false);
    }
  };

  // Copier le code
  const copyCode = () => {
    if (dossierCode) {
      navigator.clipboard.writeText(dossierCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleNbPersonnesChange = (value: string) => {
    const nb = Math.min(Math.max(parseInt(value) || 1, 1), 8);
    const newParticipants = [...formData.participants];
    while (newParticipants.length < nb) {
      newParticipants.push({ nom: '', dateNaissance: '', passportUrl: '', passportFileName: '' });
    }
    while (newParticipants.length > nb) {
      newParticipants.pop();
    }
    setFormData({ ...formData, nbPersonnesTotal: String(nb), participants: newParticipants });
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setFormData({ ...formData, participants: newParticipants });
  };

  // State pour suivre quel participant est en cours d'upload
  const [uploadingParticipantIndex, setUploadingParticipantIndex] = useState<number | null>(null);

  const handleParticipantPassportUpload = async (e: React.ChangeEvent<HTMLInputElement>, participantIndex: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingParticipantIndex(participantIndex);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('files', files[0]);
      const participantName = formData.participants[participantIndex]?.nom || formData.nomPrenom || 'client';
      uploadFormData.append('clientName', participantName);

      const response = await fetch('/api/upload-passport', { method: 'POST', body: uploadFormData });
      const result = await response.json();

      if (result.success && result.urls[0]) {
        const newParticipants = [...formData.participants];
        newParticipants[participantIndex] = {
          ...newParticipants[participantIndex],
          passportUrl: result.urls[0],
          passportFileName: files[0].name
        };
        const allPassportUrls = newParticipants
          .map(p => p.passportUrl)
          .filter((url): url is string => !!url);
        setFormData(prev => ({
          ...prev,
          participants: newParticipants,
          passportUrls: allPassportUrls
        }));
      } else {
        setError(result.error || 'Error al subir el archivo');
      }
    } catch {
      setError('Error de conexión al subir el archivo');
    } finally {
      setUploadingParticipantIndex(null);
      e.target.value = '';
    }
  };

  const removeParticipantPassport = (participantIndex: number) => {
    const newParticipants = [...formData.participants];
    newParticipants[participantIndex] = {
      ...newParticipants[participantIndex],
      passportUrl: '',
      passportFileName: ''
    };
    const allPassportUrls = newParticipants
      .map(p => p.passportUrl)
      .filter((url): url is string => !!url);
    setFormData(prev => ({
      ...prev,
      participants: newParticipants,
      passportUrls: allPassportUrls
    }));
  };

  const handleMultiSelect = (field: 'preferenceAlimentaire' | 'salades' | 'preferenceAlcool', id: number) => {
    const current = formData[field];
    if (current.includes(id)) {
      setFormData({ ...formData, [field]: current.filter(v => v !== id) });
      return;
    }
    if (field === 'salades' && current.length >= 5) return;
    setFormData({ ...formData, [field]: [...current, id] });
  };

  const nextStep = async () => {
    if (currentStep < STEPS.length && !isNavigating) {
      setIsNavigating(true);
      try {
        if (currentStep === 1 && !dossierCode) {
          await createDossier();
        } else if (dossierCode) {
          await saveDossier();
        }
        setCurrentStep(currentStep + 1);
      } finally {
        setIsNavigating(false);
      }
    }
  };
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/monday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          mondayItemId,
          dossierCode,
          lang: 'es',
        }),
      });
      const result = await response.json();
      if (result.success) {
        if (dossierCode) {
          await fetch('/api/inscription/draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'submit',
              code: dossierCode,
              mondayItemId: result.itemId,
              lang: 'es',
            }),
          });
        }
        setIsSuccess(true);
      } else {
        setError(result.error || 'Ha ocurrido un error');
      }
    } catch {
      setError('Error de conexión. Por favor, inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: return !!(formData.nomPrenom && formData.telephone && formData.email && isValidEmail(formData.email));
      case 2: return formData.nbAdultes >= 1 && !!formData.dateArrivee && !!formData.dateRetour;
      case 3: {
        if (!formData.navetteChoix) return false;
        // Traslado llegada o ambos
        if (formData.navetteChoix === '0' || formData.navetteChoix === '2') {
          if (!formData.heureArrivee || !formData.volArrivee) return false;
        }
        // Traslado salida o ambos
        if (formData.navetteChoix === '1' || formData.navetteChoix === '2') {
          if (!formData.heureDepart || !formData.volDepart) return false;
        }
        return true;
      }
      case 4: return formData.participants.every(p => p.nom && p.dateNaissance && p.passportUrl);
      case 5: return !!formData.questionnaireOuiNon;
      case 6: return true;
      case 7: return true;
      default: return false;
    }
  };

  // Page d'accueil avant le formulaire
  if (!hasStarted) {
    return (
      <>
        <PublicNavigation />
        <main className="min-h-screen bg-gradient-to-b from-[#faf9f6] to-white">
          {/* Hero */}
          <div className="relative h-[35vh] md:h-[40vh] overflow-hidden">
            <Image src="/images/hotel/FAÇADE.jpg" alt="Pessah 2026" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
              <span className="text-[#C9A227] uppercase tracking-[0.3em] text-sm mb-3 font-medium">
                Pésaj 2026
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl mb-2" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                Formulario de inscripción
              </h1>
              <p className="text-white/80 text-base" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Cabo Gata · 31 Marzo - 12 Abril 2026
              </p>
            </div>
          </div>

          {/* Contenu introduction */}
          <div className="max-w-2xl mx-auto px-6 -mt-16 relative z-10 pb-20">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
              <div className="mb-8">
                <p className="text-gray-700 font-semibold mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Por favor, complete un formulario por familia.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Cada familia (padres + hijos) debe completar su propio formulario, incluso si la reserva fue realizada por una sola persona para varios familiares.
                </p>
                <p className="text-gray-600 mb-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  👉 Si ha reservado para:
                </p>
                <ul className="text-gray-600 mb-4 ml-6 space-y-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <li>• sus padres</li>
                  <li>• sus hijos</li>
                  <li>• primos</li>
                  <li>• otra familia</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Entonces cada hogar debe completar un formulario separado con su propia información (nombres, fechas de estancia, pasaportes, etc.).
                </p>
                <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Esto nos permite organizar correctamente las habitaciones, traslados y trámites administrativos.
                </p>
                <p className="text-gray-600 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Gracias por su colaboración.
                </p>
                <p className="text-[#C9A227] font-semibold" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  El equipo K PRESTIGE
                </p>
              </div>

              {/* Boutons */}
              <div className="space-y-4">
                <button
                  onClick={() => setHasStarted(true)}
                  className="w-full inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-[#C9A227] to-[#D4AF37]
                           hover:from-[#B8922A] hover:to-[#C9A227] text-white rounded-xl font-medium text-lg
                           transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Nueva inscripción
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowResumeModal(true)}
                  className="w-full inline-flex items-center justify-center gap-3 px-10 py-4 bg-white border-2 border-[#C9A227]
                           hover:bg-[#faf9f6] text-[#C9A227] rounded-xl font-medium text-lg
                           transition-all duration-300"
                >
                  <FolderOpen className="w-5 h-5" />
                  Continuar una inscripción
                </button>
              </div>
            </div>
          </div>

          {/* Modal reprendre inscription */}
          {showResumeModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'var(--font-cormorant)' }}>
                    Continuar mi inscripción
                  </h3>
                  <button
                    onClick={() => { setShowResumeModal(false); setResumeError(null); setResumeCode(''); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  Introduzca el código de expediente que recibió por email para continuar su inscripción.
                </p>

                <div className="mb-4">
                  <input
                    type="text"
                    value={resumeCode}
                    onChange={(e) => setResumeCode(e.target.value.toUpperCase())}
                    placeholder="Ej: KP26123"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-widest
                             focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]"
                    maxLength={7}
                  />
                </div>

                {resumeError && (
                  <p className="text-red-500 text-sm mb-4 text-center">{resumeError}</p>
                )}

                <button
                  onClick={resumeDossier}
                  disabled={isLoadingDossier}
                  className="w-full py-3 bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-white rounded-xl font-medium
                           hover:from-[#B8922A] hover:to-[#C9A227] transition-all disabled:opacity-50"
                >
                  {isLoadingDossier ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Continuar'
                  )}
                </button>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </>
    );
  }

  // Page de succès
  if (isSuccess) {
    return (
      <>
        <PublicNavigation />
        <main className="min-h-screen bg-gradient-to-b from-[#faf9f6] to-white">
          <div className="relative h-[30vh] overflow-hidden">
            <Image src="/images/hotel/FAÇADE.jpg" alt="Pessah 2026" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          </div>

          <div className="max-w-2xl mx-auto px-6 -mt-20 relative z-10 pb-20">
            <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl text-gray-800 mb-6" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                Confirmación de registro
              </h1>
              <div className="text-gray-600 leading-relaxed space-y-4 mb-10" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                <p>Su solicitud de registro ha sido recibida correctamente.</p>
                <p>Si ha solicitado el servicio de traslado, el equipo de K PRESTIGE se pondrá en contacto con usted con la información detallada una vez que el horario de traslados esté finalizado según los horarios de vuelo.</p>
                <p>Gracias por su colaboración y esperamos darle la bienvenida.</p>
                <p className="text-[#C9A227] font-semibold text-lg mt-6">El equipo K PRESTIGE</p>
              </div>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C9A227] to-[#D4AF37]
                         hover:from-[#B8922A] hover:to-[#C9A227] text-white rounded-xl font-medium
                         transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicNavigation />
      <main className="min-h-screen bg-gradient-to-b from-[#faf9f6] to-white">
        {/* Hero avec image */}
        <div className="relative h-[35vh] md:h-[40vh] overflow-hidden">
          <Image
            src="/images/hotel/FAÇADE.jpg"
            alt="Pessah 2026"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
            <span className="text-[#C9A227] uppercase tracking-[0.3em] text-sm mb-3 font-medium">
              Pésaj 2026
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
              Formulario de inscripción
            </h1>
            <p className="text-white/80 text-lg" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Cabo Gata · 31 Marzo - 12 Abril 2026
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-16 relative z-10 pb-20">
          {/* Bandeau code dossier */}
          {dossierCode && (
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] rounded-t-2xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#C9A227]/20 rounded-lg p-2">
                  <FolderOpen className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Su expediente</p>
                  <p className="text-white font-mono text-lg tracking-wider">{dossierCode}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <span className="text-white/60 text-xs flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Guardando...
                  </span>
                ) : lastSaved && (
                  <span className="text-green-400/80 text-xs hidden sm:block">
                    ✓ Guardado
                  </span>
                )}
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {codeCopied ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          {/* Info conservez le code */}
          {dossierCode && currentStep === 2 && (
            <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
              <p className="text-blue-800 text-sm text-center">
                💡 <strong>¡Guarde este número con cuidado!</strong> Le permitirá continuar su inscripción en cualquier momento.
              </p>
              <p className="text-blue-600 text-xs text-center mt-1">
                📧 Se le ha enviado un email. <strong>Revise su carpeta de spam</strong> si no lo encuentra.
              </p>
            </div>
          )}

          {/* Carte principale */}
          <div className={cn("bg-white shadow-2xl overflow-hidden", dossierCode ? "rounded-b-3xl" : "rounded-3xl")}>
            {/* Progress bar */}
            <div className="px-3 md:px-8 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center min-w-0">
                        <div
                          className={cn(
                            "w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-300",
                            isActive && "bg-gradient-to-br from-[#C9A227] to-[#D4AF37] text-white shadow-lg",
                            isCompleted && "bg-green-500 text-white",
                            !isActive && !isCompleted && "bg-gray-100 text-gray-400"
                          )}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <span className={cn(
                          "text-[9px] md:text-[11px] mt-1 font-medium transition-colors text-center truncate w-full",
                          isActive ? "text-[#C9A227]" : isCompleted ? "text-green-500" : "text-gray-400"
                        )}>
                          {step.shortTitle}
                        </span>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className={cn(
                          "w-3 sm:w-5 md:w-8 lg:w-12 h-0.5 mx-0.5 sm:mx-1 rounded-full transition-colors",
                          currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37] transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Contenu du formulaire */}
            <div className="p-6 md:p-10">
              {/* Étape 1: Contact */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Sus datos de contacto
                    </h2>
                    <p className="text-gray-500 mt-2">Información de contacto para su reserva</p>
                  </div>

                  <StyledInput
                    label="Apellido + Nombre"
                    required
                    value={formData.nomPrenom}
                    onChange={(e) => setFormData({ ...formData, nomPrenom: e.target.value })}
                    placeholder="Ej: García Juan"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono móvil <span className="text-[#C9A227]">*</span>
                    </label>
                    <PhoneInput
                      value={formData.telephone}
                      onChange={(phone) => setFormData({ ...formData, telephone: phone })}
                      required
                    />
                  </div>

                  <div>
                    <StyledInput
                      label="Email"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="su@email.com"
                    />
                    {formData.email && !isValidEmail(formData.email) && (
                      <p className="text-red-500 text-xs mt-1">Por favor, introduzca una dirección de email válida</p>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 2: Composition de la famille */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Composición familiar
                    </h2>
                    <p className="text-gray-500 mt-2">Detalles de los participantes en su estancia</p>
                  </div>

                  <StyledInput
                    label="Nº Presupuesto"
                    value={formData.numDevis}
                    onChange={(e) => setFormData({ ...formData, numDevis: e.target.value })}
                    placeholder="Si ya ha recibido un presupuesto"
                  />

                  {/* Dates de séjour */}
                  <div className="bg-gradient-to-r from-[#faf9f6] to-[#f5f3ee] rounded-2xl p-5 border border-[#C9A227]/20">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C9A227]" />
                      Fechas de estancia
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <StyledInput
                        label="Fecha de llegada"
                        required
                        type="date"
                        value={formData.dateArrivee}
                        onChange={(e) => setFormData({ ...formData, dateArrivee: e.target.value })}
                        min="2026-03-31"
                        max="2026-04-12"
                      />
                      <StyledInput
                        label="Fecha de salida"
                        required
                        type="date"
                        value={formData.dateRetour}
                        onChange={(e) => setFormData({ ...formData, dateRetour: e.target.value })}
                        min="2026-03-31"
                        max="2026-04-12"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Estancia del 31 de marzo al 12 de abril de 2026
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StyledInput
                      label="Adultos"
                      required
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbAdultes || ''}
                      onChange={(e) => setFormData({ ...formData, nbAdultes: parseInt(e.target.value) || 0 })}
                    />
                    <StyledInput
                      label="Bebés (0-2 años)"
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbBebe || ''}
                      onChange={(e) => setFormData({ ...formData, nbBebe: parseInt(e.target.value) || 0 })}
                    />
                    <StyledInput
                      label="Niños 3 años"
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbEnfants3ans || ''}
                      onChange={(e) => setFormData({ ...formData, nbEnfants3ans: parseInt(e.target.value) || 0 })}
                    />
                    <StyledInput
                      label="Niños 4-6 años"
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbEnfants4a6 || ''}
                      onChange={(e) => setFormData({ ...formData, nbEnfants4a6: parseInt(e.target.value) || 0 })}
                    />
                    <StyledInput
                      label="Niños 7-11 años"
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbEnfants7a11 || ''}
                      onChange={(e) => setFormData({ ...formData, nbEnfants7a11: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}

              {/* Étape 3: Navettes */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Servicio de traslado al aeropuerto
                    </h2>
                    <p className="text-gray-500 mt-2">Traslados desde/hacia el aeropuerto de Málaga</p>
                  </div>

                  {/* Info box */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                    <div className="flex gap-3">
                      <Plane className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-2">Servicio de traslado solo desde Málaga</p>
                        <p className="text-blue-700 mb-2">
                          Los traslados se organizan únicamente desde el aeropuerto de Málaga.
                        </p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• <strong>31 marzo 2026</strong>: traslados de llegada únicamente</li>
                          <li>• <strong>12 abril 2026</strong>: traslados de salida únicamente</li>
                        </ul>
                        <p className="text-blue-600 mt-2 text-xs">
                          Los horarios de recogida se comunicarán posteriormente en función de los vuelos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Traslados deseados <span className="text-[#C9A227]">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {NAVETTE_OPTIONS_ES.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            const newData: Partial<FormData> = { navetteChoix: option.value };
                            if (option.value === '3') {
                              newData.heureArrivee = '';
                              newData.volArrivee = '';
                              newData.heureDepart = '';
                              newData.volDepart = '';
                            }
                            if (option.value === '0') {
                              newData.heureDepart = '';
                              newData.volDepart = '';
                            }
                            if (option.value === '1') {
                              newData.heureArrivee = '';
                              newData.volArrivee = '';
                            }
                            setFormData({ ...formData, ...newData });
                          }}
                          className={cn(
                            "p-4 rounded-2xl border-2 text-left transition-all duration-200",
                            formData.navetteChoix === option.value
                              ? "border-[#C9A227] bg-[#C9A227]/5 shadow-md"
                              : "border-gray-200 hover:border-[#C9A227]/50 hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                              formData.navetteChoix === option.value ? "border-[#C9A227] bg-[#C9A227]" : "border-gray-300"
                            )}>
                              {formData.navetteChoix === option.value && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="font-medium text-gray-800">{option.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Champs arrivée */}
                  {(formData.navetteChoix === '0' || formData.navetteChoix === '2') && (
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Plane className="w-4 h-4 text-[#C9A227]" />
                        Información de llegada
                      </h3>
                      <div className="flex items-center gap-2 mb-4 p-3 bg-[#C9A227]/10 rounded-xl">
                        <Calendar className="w-4 h-4 text-[#C9A227]" />
                        <span className="font-medium text-gray-700">Fecha: <span className="text-[#C9A227]">31 Marzo 2026</span></span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <StyledInput
                            label="Hora de llegada"
                            required
                            type="time"
                            value={formData.heureArrivee}
                            onChange={(e) => setFormData({ ...formData, heureArrivee: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                        <StyledInput
                          label="Número de vuelo"
                          required
                          value={formData.volArrivee}
                          onChange={(e) => setFormData({ ...formData, volArrivee: e.target.value })}
                          placeholder="Ej: IB1234"
                        />
                      </div>
                    </div>
                  )}

                  {/* Champs départ */}
                  {(formData.navetteChoix === '1' || formData.navetteChoix === '2') && (
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Plane className="w-4 h-4 text-[#C9A227] rotate-45" />
                        Información de salida
                      </h3>
                      <div className="flex items-center gap-2 mb-4 p-3 bg-[#C9A227]/10 rounded-xl">
                        <Calendar className="w-4 h-4 text-[#C9A227]" />
                        <span className="font-medium text-gray-700">Fecha: <span className="text-[#C9A227]">12 Abril 2026</span></span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <StyledInput
                            label="Hora de salida"
                            required
                            type="time"
                            value={formData.heureDepart}
                            onChange={(e) => setFormData({ ...formData, heureDepart: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                        <StyledInput
                          label="Número de vuelo"
                          required
                          value={formData.volDepart}
                          onChange={(e) => setFormData({ ...formData, volDepart: e.target.value })}
                          placeholder="Ej: IB5678"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Étape 4: Participants */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Información de viajeros
                    </h2>
                    <p className="text-gray-500 mt-2">Identidad de cada participante</p>
                  </div>

                  {/* Nombre de personnes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Número de personas <span className="text-[#C9A227]">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleNbPersonnesChange(num)}
                          className={cn(
                            "w-12 h-12 rounded-xl font-semibold transition-all duration-200",
                            formData.nbPersonnesTotal === num
                              ? "bg-gradient-to-br from-[#C9A227] to-[#D4AF37] text-white shadow-lg scale-105"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Info importante */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Importante:</strong> Para cada persona, suba su pasaporte (foto legible y de buena calidad).
                    </p>
                  </div>

                  {/* Liste des participants */}
                  <div className="space-y-4">
                    {formData.participants.map((participant, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-5">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          Persona {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <StyledInput
                            label="Apellido + Nombre"
                            required
                            value={participant.nom}
                            onChange={(e) => updateParticipant(index, 'nom', e.target.value)}
                            placeholder="Tal como aparece en el pasaporte"
                          />
                          <StyledInput
                            label="Fecha de nacimiento"
                            required
                            type="date"
                            value={participant.dateNaissance}
                            onChange={(e) => updateParticipant(index, 'dateNaissance', e.target.value)}
                          />
                        </div>

                        {/* Upload documento de identidad */}
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Pasaporte o DNI <span className="text-[#C9A227]">*</span>
                          </label>

                          {participant.passportUrl ? (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                              <div className="flex items-center gap-3">
                                <FileIcon className="w-5 h-5 text-green-600" />
                                <span className="text-sm text-green-800 font-medium">{participant.passportFileName || 'Documento'}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeParticipantPassport(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <label className={cn(
                              "relative flex items-center justify-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all duration-200",
                              uploadingParticipantIndex === index
                                ? "border-gray-300 bg-gray-50 cursor-wait"
                                : "border-gray-300 hover:border-[#C9A227] hover:bg-[#C9A227]/5"
                            )}>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleParticipantPassportUpload(e, index)}
                                disabled={uploadingParticipantIndex !== null}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                              />
                              {uploadingParticipantIndex === index ? (
                                <>
                                  <Loader2 className="w-5 h-5 text-[#C9A227] animate-spin" />
                                  <span className="text-sm text-gray-500">Subiendo...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-5 h-5 text-gray-400" />
                                  <span className="text-sm text-gray-600">Haga clic para añadir el documento</span>
                                  <span className="text-xs text-gray-400">(PDF, JPG, PNG)</span>
                                </>
                              )}
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape 5: Préférences alimentaires */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Preferencias alimentarias
                    </h2>
                    <p className="text-gray-500 mt-2">Ayúdenos a personalizar su experiencia culinaria</p>
                  </div>

                  {/* Question principale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿Desea responder al cuestionario? <span className="text-[#C9A227]">*</span>
                    </label>
                    <div className="flex gap-3">
                      {['OUI', 'NON'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFormData({ ...formData, questionnaireOuiNon: option })}
                          className={cn(
                            "flex-1 py-4 rounded-xl font-semibold transition-all duration-200",
                            formData.questionnaireOuiNon === option
                              ? "bg-gradient-to-br from-[#C9A227] to-[#D4AF37] text-white shadow-lg"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          )}
                        >
                          {option === 'OUI' ? 'SÍ' : 'NO'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.questionnaireOuiNon === 'OUI' && (
                    <div className="space-y-8 animate-fadeIn">
                      {/* Préférences alimentaires */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Preferencias alimentarias</label>
                        <div className="flex flex-wrap gap-2">
                          {MONDAY_LABELS.preferenceAlimentaire.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleMultiSelect('preferenceAlimentaire', item.id)}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                formData.preferenceAlimentaire.includes(item.id)
                                  ? "bg-[#C9A227] text-white shadow-md"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              )}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.preferenceAlimentaire.includes(5) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Otro, especifique:</label>
                          <textarea
                            value={formData.autrePreciser}
                            onChange={(e) => setFormData({ ...formData, autrePreciser: e.target.value })}
                            className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227] transition-all"
                            rows={3}
                          />
                        </div>
                      )}

                      {/* Salades */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sus 5 ensaladas preferidas
                        </label>
                        <p className={cn(
                          "text-sm mb-3 font-medium",
                          formData.salades.length >= 5 ? "text-green-600" : "text-gray-400"
                        )}>
                          {formData.salades.length}/5 seleccionadas {formData.salades.length >= 5 && "✓"}
                        </p>
                        <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto p-1">
                          {MONDAY_LABELS.salades.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleMultiSelect('salades', item.id)}
                              disabled={!formData.salades.includes(item.id) && formData.salades.length >= 5}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                                formData.salades.includes(item.id)
                                  ? "bg-[#C9A227] text-white"
                                  : formData.salades.length >= 5
                                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              )}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Alcools */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Preferencias de alcohol</label>
                        <div className="flex flex-wrap gap-2">
                          {MONDAY_LABELS.preferenceAlcool.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleMultiSelect('preferenceAlcool', item.id)}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                formData.preferenceAlcool.includes(item.id)
                                  ? "bg-[#C9A227] text-white shadow-md"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              )}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Carte des vins */}
                      {(formData.preferenceAlcool.includes(0) || formData.preferenceAlcool.includes(1) || formData.preferenceAlcool.includes(2)) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            ¿Desea recibir nuestra carta de vinos de pago?
                          </label>
                          <div className="flex gap-3">
                            {['OUI', 'NON'].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setFormData({ ...formData, carteVins: option })}
                                className={cn(
                                  "px-8 py-3 rounded-xl font-medium transition-all duration-200",
                                  formData.carteVins === option
                                    ? "bg-[#C9A227] text-white shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                              >
                                {option === 'OUI' ? 'SÍ' : 'NO'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Étape 6: Informations complémentaires */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Información adicional
                    </h2>
                    <p className="text-gray-500 mt-2">Últimas precisiones para su estancia</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Familias con las que desea sentarse
                    </label>
                    <textarea
                      value={formData.famillesTable}
                      onChange={(e) => setFormData({ ...formData, famillesTable: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227] transition-all"
                      rows={3}
                      placeholder="Nombre completo, teléfono si es posible"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Otra información
                    </label>
                    <textarea
                      value={formData.infosComplementaires}
                      onChange={(e) => setFormData({ ...formData, infosComplementaires: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227] transition-all"
                      rows={4}
                      placeholder="Solicitudes particulares, celebraciones, restricciones..."
                    />
                  </div>
                </div>
              )}

              {/* Étape 7: Récapitulatif */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Resumen de su inscripción
                    </h2>
                    <p className="text-gray-500 mt-2">Verifique su información antes de enviar</p>
                  </div>

                  {/* Contact */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Contacto
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-500">Nombre completo</span>
                        <span className="font-medium text-gray-800">{formData.nomPrenom}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-800">{formData.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-500">Teléfono</span>
                        <span className="font-medium text-gray-800">{formData.telephone}</span>
                      </div>
                      {formData.numDevis && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-500">Nº Presupuesto</span>
                          <span className="font-medium text-gray-800">{formData.numDevis}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Groupe */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Composición familiar
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-[#C9A227]/10 rounded-xl text-sm font-semibold text-gray-700">
                        {formData.nbAdultes} adulto{formData.nbAdultes > 1 ? 's' : ''}
                      </span>
                      {formData.nbEnfants7a11 > 0 && (
                        <span className="px-4 py-2 bg-blue-50 rounded-xl text-sm font-semibold text-gray-700">
                          {formData.nbEnfants7a11} niño{formData.nbEnfants7a11 > 1 ? 's' : ''} (7-11 años)
                        </span>
                      )}
                      {formData.nbEnfants4a6 > 0 && (
                        <span className="px-4 py-2 bg-green-50 rounded-xl text-sm font-semibold text-gray-700">
                          {formData.nbEnfants4a6} niño{formData.nbEnfants4a6 > 1 ? 's' : ''} (4-6 años)
                        </span>
                      )}
                      {formData.nbEnfants3ans > 0 && (
                        <span className="px-4 py-2 bg-purple-50 rounded-xl text-sm font-semibold text-gray-700">
                          {formData.nbEnfants3ans} niño{formData.nbEnfants3ans > 1 ? 's' : ''} (-3 años)
                        </span>
                      )}
                      {formData.nbBebe > 0 && (
                        <span className="px-4 py-2 bg-pink-50 rounded-xl text-sm font-semibold text-gray-700">
                          {formData.nbBebe} bebé{formData.nbBebe > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Navettes */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Bus className="w-4 h-4" />
                      Traslados al aeropuerto
                    </h4>
                    {formData.navetteChoix === '3' ? (
                      <p className="text-gray-500 italic">No se solicitó traslado</p>
                    ) : (
                      <div className="space-y-3">
                        {(formData.navetteChoix === '0' || formData.navetteChoix === '2') && (
                          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Plane className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">Llegada - 31 Marzo 2026</p>
                              <p className="text-gray-600">Vuelo <span className="font-medium">{formData.volArrivee}</span> a las <span className="font-medium">{formData.heureArrivee}</span></p>
                            </div>
                          </div>
                        )}
                        {(formData.navetteChoix === '1' || formData.navetteChoix === '2') && (
                          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                              <Plane className="w-6 h-6 text-orange-600 rotate-45" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">Salida - 12 Abril 2026</p>
                              <p className="text-gray-600">Vuelo <span className="font-medium">{formData.volDepart}</span> a las <span className="font-medium">{formData.heureDepart}</span></p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Voyageurs */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Viajeros ({formData.participants.length})
                    </h4>
                    <div className="space-y-2">
                      {formData.participants.map((p, i) => (
                        <div key={i} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
                          <span className="font-medium text-gray-800">{p.nom}</span>
                          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-lg">{p.dateNaissance}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documentos de identidad */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <FileIcon className="w-4 h-4" />
                      Documentos de identidad ({formData.participants.filter(p => p.passportUrl).length}/{formData.participants.length})
                    </h4>
                    <div className="space-y-2">
                      {formData.participants.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 min-w-[120px]">{p.nom || `Persona ${i + 1}`}:</span>
                          {p.passportUrl ? (
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              {p.passportFileName || 'Documento'}
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm">
                              No proporcionado
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message de confirmation */}
                  <div className="bg-gradient-to-r from-[#C9A227]/10 to-[#D4AF37]/10 rounded-2xl p-6 border border-[#C9A227]/20">
                    <p className="text-center text-gray-700">
                      Al hacer clic en <span className="font-semibold">"Enviar inscripción"</span>, confirma la exactitud de la información anterior.
                    </p>
                  </div>
                </div>
              )}

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className={cn("flex mt-10 pt-6 border-t border-gray-100", currentStep === 1 ? "justify-end" : "justify-between")}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>
                )}

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep) || isNavigating}
                    className={cn(
                      "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200",
                      isStepValid(currentStep) && !isNavigating
                        ? "bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-white shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] active:translate-y-0"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    {isNavigating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={cn(
                      "flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-white rounded-xl font-medium shadow-lg transition-all duration-200",
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] active:translate-y-0"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Enviar inscripción
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* CSS pour l'animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
