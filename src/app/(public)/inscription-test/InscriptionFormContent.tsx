'use client';

import { useState } from 'react';
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
  Clock
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { cn } from '@/lib/utils';
import { MONDAY_LABELS } from '@/lib/monday-config';

// Types
interface Participant {
  nom: string;
  dateNaissance: string;
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
  dateArrivee: '2026-03-31',
  heureArrivee: '',
  volArrivee: '',
  dateRetour: '2026-04-12',
  heureDepart: '',
  volDepart: '',
  nbPersonnesTotal: '1',
  participants: [{ nom: '', dateNaissance: '' }],
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
  { id: 1, title: 'Contact', shortTitle: 'Contact', icon: User },
  { id: 2, title: 'Groupe', shortTitle: 'Groupe', icon: Users },
  { id: 3, title: 'Navettes', shortTitle: 'Navettes', icon: Bus },
  { id: 4, title: 'Voyageurs', shortTitle: 'Voyageurs', icon: UserCheck },
  { id: 5, title: 'Repas', shortTitle: 'Repas', icon: Utensils },
  { id: 6, title: 'Infos', shortTitle: 'Infos', icon: MessageSquare },
  { id: 7, title: 'Récap', shortTitle: 'Récap', icon: CheckCircle },
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

// Composant Select stylisé
function StyledSelect({
  label,
  required,
  options,
  value,
  onChange,
  className
}: {
  label?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-[#C9A227]">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]
                   transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
      >
        <option value="">Sélectionner...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function InscriptionFormContent() {
  const { dir } = useLanguage();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);

  const handleNbPersonnesChange = (value: string) => {
    const nb = Math.min(Math.max(parseInt(value) || 1, 1), 8);
    const newParticipants = [...formData.participants];
    while (newParticipants.length < nb) {
      newParticipants.push({ nom: '', dateNaissance: '' });
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

  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      const uploadFormData = new FormData();
      Array.from(files).forEach(file => uploadFormData.append('files', file));
      uploadFormData.append('clientName', formData.nomPrenom || 'client');
      const response = await fetch('/api/upload-passport', { method: 'POST', body: uploadFormData });
      const result = await response.json();
      if (result.success) {
        const newFiles = Array.from(files).map((file, index) => ({ name: file.name, url: result.urls[index] }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
        setFormData(prev => ({ ...prev, passportUrls: [...prev.passportUrls, ...result.urls] }));
      } else {
        setError(result.error || 'Erreur lors de l\'upload');
      }
    } catch {
      setError('Erreur de connexion lors de l\'upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, passportUrls: prev.passportUrls.filter((_, i) => i !== index) }));
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

  const nextStep = () => currentStep < STEPS.length && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/monday', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || 'Une erreur est survenue');
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: return !!(formData.nomPrenom && formData.telephone && formData.email && isValidEmail(formData.email));
      case 2: return formData.nbAdultes >= 1;
      case 3: {
        if (!formData.navetteChoix) return false;
        // Navette arrivée ou les deux
        if (formData.navetteChoix === '0' || formData.navetteChoix === '2') {
          if (!formData.heureArrivee || !formData.volArrivee) return false;
        }
        // Navette départ ou les deux
        if (formData.navetteChoix === '1' || formData.navetteChoix === '2') {
          if (!formData.heureDepart || !formData.volDepart) return false;
        }
        return true;
      }
      case 4: return formData.participants.every(p => p.nom && p.dateNaissance);
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
          {/* Hero - plus petit */}
          <div className="relative h-[35vh] md:h-[40vh] overflow-hidden">
            <Image src="/images/hotel/FAÇADE.jpg" alt="Pessah 2026" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
              <span className="text-[#C9A227] uppercase tracking-[0.3em] text-sm mb-3 font-medium">
                Pessah 2026
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl mb-2" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                Formulaire d'inscription
              </h1>
              <p className="text-white/80 text-base" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Cabo Gata · 31 Mars - 12 Avril 2026
              </p>
            </div>
          </div>

          {/* Contenu introduction */}
          <div className="max-w-2xl mx-auto px-6 -mt-16 relative z-10 pb-20">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
              {/* Texte original Monday */}
              <div className="mb-8">
                <p className="text-gray-700 font-semibold mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Merci de remplir un formulaire par famille.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Chaque famille (parents + enfants) doit compléter son propre formulaire, même si la réservation a été faite par une seule personne pour plusieurs proches.
                </p>
                <p className="text-gray-600 mb-3" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  👉 Si vous avez réservé pour :
                </p>
                <ul className="text-gray-600 mb-4 ml-6 space-y-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <li>• vos parents</li>
                  <li>• vos enfants</li>
                  <li>• des cousins</li>
                  <li>• une autre famille</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Alors chaque foyer doit remplir un formulaire séparé avec ses propres informations (noms, dates de séjour, passeports, etc.).
                </p>
                <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Cela nous permet d'organiser correctement les chambres, transferts et formalités administratives.
                </p>
                <p className="text-gray-600 mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Merci pour votre collaboration.
                </p>
                <p className="text-[#C9A227] font-semibold" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  L'équipe K PRESTIGE
                </p>
              </div>

              {/* Bouton commencer */}
              <div className="text-center">
                <button
                  onClick={() => setHasStarted(true)}
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-[#C9A227] to-[#D4AF37]
                           hover:from-[#B8922A] hover:to-[#C9A227] text-white rounded-xl font-medium text-lg
                           transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Commencer
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
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
          {/* Hero minimal */}
          <div className="relative h-[30vh] overflow-hidden">
            <Image src="/images/hotel/FAÇADE.jpg" alt="Pessah 2026" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          </div>

          {/* Contenu confirmation */}
          <div className="max-w-2xl mx-auto px-6 -mt-20 relative z-10 pb-20">
            <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl text-gray-800 mb-6" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                Confirmation d'enregistrement
              </h1>
              <div className="text-gray-600 leading-relaxed space-y-4 mb-10" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                <p>Votre demande d'enregistrement a bien été prise en compte.</p>
                <p>Si vous avez sollicité le service de navette, l'équipe K PRESTIGE reviendra vers vous avec les informations détaillées dès que le planning des transferts sera finalisé en fonction des horaires de vol.</p>
                <p>Merci pour votre collaboration et au plaisir de vous accueillir.</p>
                <p className="text-[#C9A227] font-semibold text-lg mt-6">L'équipe K PRESTIGE</p>
              </div>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#C9A227] to-[#D4AF37]
                         hover:from-[#B8922A] hover:to-[#C9A227] text-white rounded-xl font-medium
                         transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Retour à l'accueil
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
      <main className={cn("min-h-screen bg-gradient-to-b from-[#faf9f6] to-white", dir === 'rtl' && 'text-right')} dir={dir}>
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
              Pessah 2026
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
              Formulaire d'inscription
            </h1>
            <p className="text-white/80 text-lg" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Cabo Gata · 31 Mars - 12 Avril 2026
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-16 relative z-10 pb-20">
          {/* Carte principale */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="px-3 md:px-8 pt-6 pb-4 border-b border-gray-100">
              {/* Steps - version compacte */}
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
              {/* Barre de progression */}
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
                      Vos coordonnées
                    </h2>
                    <p className="text-gray-500 mt-2">Informations de contact pour votre réservation</p>
                  </div>

                  <StyledInput
                    label="Nom + Prénom"
                    required
                    value={formData.nomPrenom}
                    onChange={(e) => setFormData({ ...formData, nomPrenom: e.target.value })}
                    placeholder="Ex: Dupont Jean"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone portable <span className="text-[#C9A227]">*</span>
                    </label>
                    <PhoneInput
                      value={formData.telephone}
                      onChange={(phone) => setFormData({ ...formData, telephone: phone })}
                      required
                      dir={dir}
                    />
                  </div>

                  <div>
                    <StyledInput
                      label="E-mail"
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                    />
                    {formData.email && !isValidEmail(formData.email) && (
                      <p className="text-red-500 text-xs mt-1">Veuillez entrer une adresse email valide</p>
                    )}
                  </div>
                </div>
              )}

              {/* Étape 2: Composition du groupe */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Composition du groupe
                    </h2>
                    <p className="text-gray-500 mt-2">Détails des participants à votre séjour</p>
                  </div>

                  <StyledInput
                    label="N° Devis"
                    value={formData.numDevis}
                    onChange={(e) => setFormData({ ...formData, numDevis: e.target.value })}
                    placeholder="Si vous avez déjà reçu un devis"
                  />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <StyledInput
                      label="Adultes"
                      required
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbAdultes || ''}
                      onChange={(e) => setFormData({ ...formData, nbAdultes: parseInt(e.target.value) || 0 })}
                    />
                    <StyledInput
                      label="Bébés (0-2 ans)"
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbBebe || ''}
                      onChange={(e) => setFormData({ ...formData, nbBebe: parseInt(e.target.value) || 0 })}
                    />
                    <StyledInput
                      label="Enfants 3 ans"
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbEnfants3ans || ''}
                      onChange={(e) => setFormData({ ...formData, nbEnfants3ans: parseInt(e.target.value) || 0 })}
                    />
                    <StyledInput
                      label="Enfants 4-6 ans"
                      type="number"
                      min={0}
                      placeholder=""
                      value={formData.nbEnfants4a6 || ''}
                      onChange={(e) => setFormData({ ...formData, nbEnfants4a6: parseInt(e.target.value) || 0 })}
                    />
                    <StyledInput
                      label="Enfants 7-11 ans"
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
                      Service navette aéroport
                    </h2>
                    <p className="text-gray-500 mt-2">Transferts depuis/vers l'aéroport de Malaga</p>
                  </div>

                  {/* Info box */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                    <div className="flex gap-3">
                      <Plane className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-2">Service navette Malaga uniquement</p>
                        <p className="text-blue-700 mb-2">
                          Les navettes sont organisées uniquement au départ de l'aéroport de Malaga.
                        </p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• <strong>31 mars 2026</strong> : navettes arrivées uniquement</li>
                          <li>• <strong>12 avril 2026</strong> : navettes départs uniquement</li>
                        </ul>
                        <p className="text-blue-600 mt-2 text-xs">
                          Les horaires de prise en charge seront communiqués ultérieurement en fonction des vols.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Navettes souhaitées <span className="text-[#C9A227]">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {MONDAY_LABELS.navetteChoix.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, navetteChoix: option.value })}
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

                  {/* Champs arrivée - Date fixe 31 mars */}
                  {(formData.navetteChoix === '0' || formData.navetteChoix === '2') && (
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Plane className="w-4 h-4 text-[#C9A227]" />
                        Informations arrivée
                      </h3>
                      <div className="flex items-center gap-2 mb-4 p-3 bg-[#C9A227]/10 rounded-xl">
                        <Calendar className="w-4 h-4 text-[#C9A227]" />
                        <span className="font-medium text-gray-700">Date : <span className="text-[#C9A227]">31 Mars 2026</span></span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <StyledInput
                            label="Heure d'arrivée"
                            required
                            type="time"
                            value={formData.heureArrivee}
                            onChange={(e) => setFormData({ ...formData, heureArrivee: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                        <StyledInput
                          label="Numéro de vol"
                          required
                          value={formData.volArrivee}
                          onChange={(e) => setFormData({ ...formData, volArrivee: e.target.value })}
                          placeholder="Ex: AF1234"
                        />
                      </div>
                    </div>
                  )}

                  {/* Champs départ - Date fixe 12 avril */}
                  {(formData.navetteChoix === '1' || formData.navetteChoix === '2') && (
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Plane className="w-4 h-4 text-[#C9A227] rotate-45" />
                        Informations départ
                      </h3>
                      <div className="flex items-center gap-2 mb-4 p-3 bg-[#C9A227]/10 rounded-xl">
                        <Calendar className="w-4 h-4 text-[#C9A227]" />
                        <span className="font-medium text-gray-700">Date : <span className="text-[#C9A227]">12 Avril 2026</span></span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <StyledInput
                            label="Heure de départ"
                            required
                            type="time"
                            value={formData.heureDepart}
                            onChange={(e) => setFormData({ ...formData, heureDepart: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                        <StyledInput
                          label="Numéro de vol"
                          required
                          value={formData.volDepart}
                          onChange={(e) => setFormData({ ...formData, volDepart: e.target.value })}
                          placeholder="Ex: AF5678"
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
                      Informations voyageurs
                    </h2>
                    <p className="text-gray-500 mt-2">Identité de chaque participant</p>
                  </div>

                  {/* Alert passeports */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
                    <p className="text-sm text-amber-800">
                      <strong>Important :</strong> Merci de télécharger des passeports parfaitement lisibles et en bonne qualité.
                    </p>
                  </div>

                  {/* Nombre de personnes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Nombre de personnes <span className="text-[#C9A227]">*</span>
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

                  {/* Liste des participants */}
                  <div className="space-y-4">
                    {formData.participants.map((participant, index) => (
                      <div key={index} className="bg-gray-50 rounded-2xl p-5">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          Personne {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <StyledInput
                            label="Nom + Prénom"
                            required
                            value={participant.nom}
                            onChange={(e) => updateParticipant(index, 'nom', e.target.value)}
                            placeholder="Tel qu'il apparaît sur le passeport"
                          />
                          <StyledInput
                            label="Date de naissance"
                            required
                            type="date"
                            value={participant.dateNaissance}
                            onChange={(e) => updateParticipant(index, 'dateNaissance', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload passeports */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Documents passeports
                    </label>

                    {uploadedFiles.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                              <FileIcon className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-green-800 font-medium">{file.name}</span>
                            </div>
                            <button type="button" onClick={() => removeUploadedFile(index)} className="text-red-500 hover:text-red-700 p-1">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className={cn(
                      "relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200",
                      isUploading ? "border-gray-300 bg-gray-50 cursor-wait" : "border-gray-300 hover:border-[#C9A227] hover:bg-[#C9A227]/5"
                    )}>
                      <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handlePassportUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait" />
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-10 h-10 text-[#C9A227] animate-spin mb-3" />
                          <span className="text-gray-500">Upload en cours...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-10 h-10 text-gray-400 mb-3" />
                          <span className="font-medium text-gray-600">Cliquez pour ajouter des fichiers</span>
                          <span className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG (max 10MB)</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Étape 5: Préférences alimentaires */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Préférences alimentaires
                    </h2>
                    <p className="text-gray-500 mt-2">Aidez-nous à personnaliser votre expérience culinaire</p>
                  </div>

                  {/* Question principale */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Souhaitez-vous répondre au questionnaire ? <span className="text-[#C9A227]">*</span>
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
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.questionnaireOuiNon === 'OUI' && (
                    <div className="space-y-8 animate-fadeIn">
                      {/* Préférences alimentaires */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Préférences alimentaires</label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Autre, précisez :</label>
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
                          Vos 5 salades préférées
                        </label>
                        <p className={cn(
                          "text-sm mb-3 font-medium",
                          formData.salades.length >= 5 ? "text-green-600" : "text-gray-400"
                        )}>
                          {formData.salades.length}/5 sélectionnées {formData.salades.length >= 5 && "✓"}
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
                        <label className="block text-sm font-medium text-gray-700 mb-3">Préférences alcool</label>
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
                            Souhaitez-vous recevoir notre carte des vins payante ?
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
                                {option}
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
                      Informations complémentaires
                    </h2>
                    <p className="text-gray-500 mt-2">Dernières précisions pour votre séjour</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Familles avec lesquelles vous souhaitez vous asseoir
                    </label>
                    <textarea
                      value={formData.famillesTable}
                      onChange={(e) => setFormData({ ...formData, famillesTable: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227] transition-all"
                      rows={3}
                      placeholder="Nom complet, prénom, téléphone si possible"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Autres informations
                    </label>
                    <textarea
                      value={formData.infosComplementaires}
                      onChange={(e) => setFormData({ ...formData, infosComplementaires: e.target.value })}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227] transition-all"
                      rows={4}
                      placeholder="Demandes particulières, célébrations, contraintes..."
                    />
                  </div>
                </div>
              )}

              {/* Étape 7: Récapitulatif */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl text-gray-800" style={{ fontFamily: 'var(--font-cormorant)', fontWeight: 600 }}>
                      Récapitulatif de votre inscription
                    </h2>
                    <p className="text-gray-500 mt-2">Vérifiez vos informations avant d'envoyer</p>
                  </div>

                  {/* Contact */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Contact
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-500">Nom complet</span>
                        <span className="font-medium text-gray-800">{formData.nomPrenom}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-800">{formData.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-gray-500">Téléphone</span>
                        <span className="font-medium text-gray-800">{formData.telephone}</span>
                      </div>
                      {formData.numDevis && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-500">N° Devis</span>
                          <span className="font-medium text-gray-800">{formData.numDevis}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Groupe */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Composition du groupe
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-[#C9A227]/10 rounded-xl text-sm font-semibold text-gray-700">
                        {formData.nbAdultes} adulte{formData.nbAdultes > 1 ? 's' : ''}
                      </span>
                      {formData.nbEnfants7a11 > 0 && (
                        <span className="px-4 py-2 bg-blue-50 rounded-xl text-sm font-semibold text-gray-700">
                          {formData.nbEnfants7a11} enfant{formData.nbEnfants7a11 > 1 ? 's' : ''} (7-11 ans)
                        </span>
                      )}
                      {formData.nbEnfants4a6 > 0 && (
                        <span className="px-4 py-2 bg-green-50 rounded-xl text-sm font-semibold text-gray-700">
                          {formData.nbEnfants4a6} enfant{formData.nbEnfants4a6 > 1 ? 's' : ''} (4-6 ans)
                        </span>
                      )}
                      {formData.nbEnfants3ans > 0 && (
                        <span className="px-4 py-2 bg-purple-50 rounded-xl text-sm font-semibold text-gray-700">
                          {formData.nbEnfants3ans} enfant{formData.nbEnfants3ans > 1 ? 's' : ''} (-3 ans)
                        </span>
                      )}
                      {formData.nbBebe > 0 && (
                        <span className="px-4 py-2 bg-pink-50 rounded-xl text-sm font-semibold text-gray-700">
                          {formData.nbBebe} bébé{formData.nbBebe > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Navettes */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Bus className="w-4 h-4" />
                      Navettes aéroport
                    </h4>
                    {formData.navetteChoix === '3' ? (
                      <p className="text-gray-500 italic">Pas de navette demandée</p>
                    ) : (
                      <div className="space-y-3">
                        {(formData.navetteChoix === '0' || formData.navetteChoix === '2') && (
                          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Plane className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">Arrivée - 31 Mars 2026</p>
                              <p className="text-gray-600">Vol <span className="font-medium">{formData.volArrivee}</span> à <span className="font-medium">{formData.heureArrivee}</span></p>
                            </div>
                          </div>
                        )}
                        {(formData.navetteChoix === '1' || formData.navetteChoix === '2') && (
                          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                              <Plane className="w-6 h-6 text-orange-600 rotate-45" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">Départ - 12 Avril 2026</p>
                              <p className="text-gray-600">Vol <span className="font-medium">{formData.volDepart}</span> à <span className="font-medium">{formData.heureDepart}</span></p>
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
                      Voyageurs ({formData.participants.length})
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

                  {/* Passeports uploadés */}
                  {uploadedFiles.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h4 className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide mb-4 flex items-center gap-2">
                        <FileIcon className="w-4 h-4" />
                        Passeports ({uploadedFiles.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((file, i) => (
                          <span key={i} className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            {file.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message de confirmation */}
                  <div className="bg-gradient-to-r from-[#C9A227]/10 to-[#D4AF37]/10 rounded-2xl p-6 border border-[#C9A227]/20">
                    <p className="text-center text-gray-700">
                      En cliquant sur <span className="font-semibold">"Envoyer l'inscription"</span>, vous confirmez l'exactitude des informations ci-dessus.
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
                    Précédent
                  </button>
                )}

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className={cn(
                      "flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300",
                      isStepValid(currentStep)
                        ? "bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    Suivant
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Envoyer l'inscription
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
