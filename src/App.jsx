import { useState } from "react";

const T = {
  en: {
    pageTitle: "🏥 Clinic Voice Agent — Onboarding",
    pageSubtitle: "Answer these questions so we can build your custom clinic voice agent",
    step: "Step",
    of: "of",
    filled: "filled",
    selectPlaceholder: "Select...",
    back: "← Back",
    next: "Next →",
    submitting: "Submitting...",
    submit: "✓ Submit",
    completed: "Onboarding Complete",
    completedSub: (f, t) => `${f} of ${t} fields filled. Your clinic voice agent will be built based on this.`,
    editAnswers: "← Edit Answers",
    errorMsg: "Something went wrong. Please try again.",
    formType: "Clinic Onboarding",
  },
  de: {
    pageTitle: "🏥 Praxis Voice Agent — Onboarding",
    pageSubtitle: "Beantworten Sie diese Fragen, damit wir Ihren individuellen Voice Agent erstellen können",
    step: "Schritt",
    of: "von",
    filled: "ausgefüllt",
    selectPlaceholder: "Auswählen...",
    back: "← Zurück",
    next: "Weiter →",
    submitting: "Wird gesendet...",
    submit: "✓ Absenden",
    completed: "Onboarding abgeschlossen",
    completedSub: (f, t) => `${f} von ${t} Feldern ausgefüllt. Ihr Voice Agent wird auf dieser Basis erstellt.`,
    editAnswers: "← Antworten bearbeiten",
    errorMsg: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    formType: "Klinik Onboarding",
  },
};

const SECTIONS = {
  en: [
    {
      id: "clinic",
      title: "Your Clinic",
      icon: "🏥",
      fields: [
        { key: "clinicName", label: "Clinic / Practice Name", type: "text", placeholder: "e.g. Smile Dental Clinic" },
        { key: "clinicType", label: "Type of Clinic", type: "select", options: ["Dental Clinic", "General Practice", "Dermatology", "Physiotherapy", "Veterinary", "Pediatrics", "Ophthalmology", "Orthopedics", "Psychology / Therapy", "Other"] },
        { key: "clinicTypeOther", label: "If Other, specify", type: "text", placeholder: "e.g. Cardiology, ENT...", conditional: (data) => data.clinicType === "Other" },
        { key: "location", label: "Location (City, Country)", type: "text", placeholder: "e.g. Munich, Germany" },
        { key: "languages", label: "Language(s) the agent should speak", type: "text", placeholder: "e.g. English, German" },
        { key: "businessHours", label: "Business Hours", type: "textarea", placeholder: "e.g.\nMon-Fri: 8:00 - 18:00\nSat: 9:00 - 13:00\nSun: Closed" },
      ],
    },
    {
      id: "agent",
      title: "Agent Persona",
      icon: "🤖",
      fields: [
        { key: "agentName", label: "Agent Name", type: "text", placeholder: "e.g. Lisa, Max, Sophie..." },
        { key: "agentGender", label: "Voice / Gender", type: "select", options: ["Female", "Male", "Neutral"] },
        { key: "toneStyle", label: "Tone & Style", type: "multiselect", options: ["Warm & Caring", "Professional & Formal", "Friendly & Casual", "Calm & Reassuring", "Energetic & Upbeat", "Empathetic & Patient"] },
        { key: "voiceClone", label: "Would you like to clone a custom voice (Voice Clone)?", type: "select", options: ["Yes — clone a custom voice", "No — use a standard AI voice", "Not sure yet — decide later"] },
        { key: "voiceCloneNotes", label: "If yes, whose voice should be cloned?", type: "text", placeholder: "e.g. Receptionist's voice, doctor's voice...", conditional: (data) => data.voiceClone === "Yes — clone a custom voice" },
        { key: "phoneSetup", label: "Which phone number should the agent use?", type: "select", options: ["My existing number (call forwarding)", "Generate a new number", "Both — existing + new number", "Not sure yet"] },
        { key: "existingNumber", label: "Your current business phone number", type: "text", placeholder: "e.g. +1 555 123 4567", conditional: (data) => data.phoneSetup === "My existing number (call forwarding)" || data.phoneSetup === "Both — existing + new number" },
        { key: "personalityNotes", label: "Any specific personality traits? (optional)", type: "textarea", placeholder: "e.g. Should be extra patient with elderly callers, use simple language, avoid medical jargon..." },
      ],
    },
    {
      id: "services",
      title: "Services & Offerings",
      icon: "💊",
      fields: [
        { key: "mainServices", label: "Main services / treatments (if all info is on your website, a link is enough)", type: "textarea", placeholder: "e.g. https://www.your-clinic.com/services\n\nOr manually:\n- Teeth cleaning\n- Fillings & crowns\n- Orthodontics\n- Whitening\n- Emergency dental care" },
        { key: "doctors", label: "Doctors / specialists (names & specialties)", type: "textarea", placeholder: "e.g.\nDr. Smith - General Dentistry\nDr. Jones - Orthodontics" },
        { key: "insuranceAccepted", label: "Insurance types accepted", type: "text", placeholder: "e.g. Public & private, Blue Cross, Aetna, Cigna..." },
        { key: "specialNotes", label: "Anything unique about your clinic?", type: "textarea", placeholder: "e.g. Kid-friendly, wheelchair accessible, sedation available, anxiety-friendly..." },
      ],
    },
    {
      id: "calls",
      title: "Call Scenarios",
      icon: "📞",
      fields: [
        { key: "callerReasons", label: "Why do patients typically call? (select all that apply)", type: "multiselect", options: ["Book an appointment", "Reschedule / Cancel", "Ask about services & prices", "Emergency / Urgent care", "Insurance & billing", "Hours & directions", "Prescription / Referral", "Test results / Follow-up", "General inquiries"] },
        { key: "callerReasonsOther", label: "Other common call reasons?", type: "text", placeholder: "e.g. Post-surgery check-in, callback requests..." },
        { key: "infoToCollect", label: "What info should the agent collect from callers?", type: "multiselect", options: ["Full name", "Date of birth", "Phone number", "Email address", "Insurance details", "Preferred doctor", "Preferred date/time", "Reason for visit", "Existing patient (yes/no)"] },
        { key: "infoToCollectOther", label: "Other info to collect?", type: "text", placeholder: "e.g. Patient ID, referral source..." },
      ],
    },
    {
      id: "objections",
      title: "Common Questions & Objections",
      icon: "❓",
      fields: [
        { key: "faq1", label: "FAQ #1 — Question", type: "text", placeholder: "e.g. How much does a cleaning cost?" },
        { key: "faq1Answer", label: "FAQ #1 — How should the agent respond?", type: "textarea", placeholder: "e.g. Prices depend on insurance coverage. A standard cleaning starts at..." },
        { key: "faq2", label: "FAQ #2 — Question", type: "text", placeholder: "e.g. Do you accept new patients?" },
        { key: "faq2Answer", label: "FAQ #2 — How should the agent respond?", type: "textarea", placeholder: "" },
        { key: "faq3", label: "FAQ #3 — Question", type: "text", placeholder: "e.g. What should I do in a dental emergency?" },
        { key: "faq3Answer", label: "FAQ #3 — How should the agent respond?", type: "textarea", placeholder: "" },
        { key: "topObjection", label: "Most common objection / hesitation from callers?", type: "textarea", placeholder: "e.g. 'I'm scared of the dentist' → Agent should reassure about gentle treatment options..." },
        { key: "boundaryTopics", label: "Topics the agent should NOT handle (redirect to staff)?", type: "textarea", placeholder: "e.g. Detailed medical advice, pricing negotiations, complaints..." },
      ],
    },
    {
      id: "technical",
      title: "Technical & Workflow",
      icon: "⚙️",
      fields: [
        { key: "hasCRM", label: "Do you use a CRM or patient management system?", type: "select", options: ["Yes", "No"] },
        { key: "crmName", label: "Which system?", type: "select", options: ["Doctolib", "Jameda", "Dr. Flex", "Dentally", "Dampsoft", "Google Calendar", "HubSpot", "Salesforce", "Other"], conditional: (data) => data.hasCRM === "Yes" },
        { key: "crmNameOther", label: "If Other, which system?", type: "text", placeholder: "e.g. Calendly, proprietary system...", conditional: (data) => data.hasCRM === "Yes" && data.crmName === "Other" },
        { key: "bookingSystem", label: "Do you use a separate booking/calendar system?", type: "select", options: ["Yes — same as CRM", "Yes — separate system", "No — agent should just collect info"] },
        { key: "bookingSystemName", label: "Which booking system?", type: "text", placeholder: "e.g. Calendly, Cal.com, Acuity...", conditional: (data) => data.bookingSystem === "Yes — separate system" },
        { key: "sendConfirmation", label: "Should the agent send appointment confirmations?", type: "select", options: ["Yes", "No"] },
        { key: "confirmationMethod", label: "How should confirmations be sent? (select all that apply)", type: "multiselect", options: ["WhatsApp", "SMS", "Email"], conditional: (data) => data.sendConfirmation === "Yes" },
        { key: "sendReminders", label: "Should the agent send appointment reminders?", type: "select", options: ["Yes", "No"], conditional: (data) => data.sendConfirmation === "Yes" },
        { key: "reminderTiming", label: "When should reminders be sent?", type: "multiselect", options: ["24 hours before", "2 hours before", "Morning of appointment", "Day before at 6 PM"], conditional: (data) => data.sendConfirmation === "Yes" && data.sendReminders === "Yes" },
        { key: "afterHoursBehavior", label: "What should happen when someone calls outside hours?", type: "select", options: ["Take a message", "Redirect to emergency number", "Inform hours & ask to call back", "Offer callback scheduling"] },
        { key: "emergencyNumber", label: "Emergency / after-hours number", type: "text", placeholder: "e.g. +1 555 123 4567", conditional: (data) => data.afterHoursBehavior === "Redirect to emergency number" },
        { key: "additionalNotes", label: "Anything else we should know?", type: "textarea", placeholder: "Special workflows, integrations, or requirements..." },
      ],
    },
  ],
  de: [
    {
      id: "clinic",
      title: "Ihre Praxis",
      icon: "🏥",
      fields: [
        { key: "clinicName", label: "Name der Praxis / Klinik", type: "text", placeholder: "z.B. Zahnärzte am Marktplatz" },
        { key: "clinicType", label: "Art der Praxis", type: "select", options: ["Zahnarztpraxis", "Allgemeinmedizin", "Dermatologie", "Physiotherapie", "Tierarztpraxis", "Kinderarztpraxis", "Augenheilkunde", "Orthopädie", "Psychotherapie", "Sonstige"] },
        { key: "clinicTypeOther", label: "Falls Sonstige, welche?", type: "text", placeholder: "z.B. Kardiologie, HNO...", conditional: (data) => data.clinicType === "Sonstige" },
        { key: "location", label: "Standort (Stadt, Land)", type: "text", placeholder: "z.B. Wien, Österreich" },
        { key: "languages", label: "Sprache(n) des Agenten", type: "text", placeholder: "z.B. Deutsch, Englisch" },
        { key: "businessHours", label: "Öffnungszeiten", type: "textarea", placeholder: "z.B.\nMo-Fr: 8:00 - 18:00\nSa: 9:00 - 13:00\nSo: Geschlossen" },
      ],
    },
    {
      id: "agent",
      title: "Agent-Persönlichkeit",
      icon: "🤖",
      fields: [
        { key: "agentName", label: "Name des Agenten", type: "text", placeholder: "z.B. Lisa, Max, Sophie..." },
        { key: "agentGender", label: "Stimme / Geschlecht", type: "select", options: ["Weiblich", "Männlich", "Neutral"] },
        { key: "toneStyle", label: "Tonalität & Stil", type: "multiselect", options: ["Warm & Fürsorglich", "Professionell & Formell", "Freundlich & Locker", "Ruhig & Beruhigend", "Energisch & Aufgeweckt", "Einfühlsam & Geduldig"] },
        { key: "voiceClone", label: "Möchten Sie eine eigene Stimme klonen lassen (Voice Clone)?", type: "select", options: ["Ja — eigene Stimme klonen", "Nein — KI-Standardstimme verwenden", "Weiß noch nicht — später entscheiden"] },
        { key: "voiceCloneNotes", label: "Falls ja, wessen Stimme soll geklont werden?", type: "text", placeholder: "z.B. Stimme der Empfangsdame, des Arztes...", conditional: (data) => data.voiceClone === "Ja — eigene Stimme klonen" },
        { key: "phoneSetup", label: "Welche Telefonnummer soll der Agent nutzen?", type: "select", options: ["Eigene bestehende Nummer (Weiterleitung)", "Neue Nummer generieren", "Beides — eigene Nummer + neue Nummer", "Weiß noch nicht"] },
        { key: "existingNumber", label: "Ihre aktuelle Praxis-Telefonnummer", type: "text", placeholder: "z.B. +49 89 123 456", conditional: (data) => data.phoneSetup === "Eigene bestehende Nummer (Weiterleitung)" || data.phoneSetup === "Beides — eigene Nummer + neue Nummer" },
        { key: "personalityNotes", label: "Besondere Persönlichkeitsmerkmale? (optional)", type: "textarea", placeholder: "z.B. Soll besonders geduldig mit älteren Patienten sein, einfache Sprache verwenden, medizinischen Fachjargon vermeiden..." },
      ],
    },
    {
      id: "services",
      title: "Leistungen & Angebot",
      icon: "💊",
      fields: [
        { key: "mainServices", label: "Hauptleistungen / Behandlungen (wenn alle Infos auf der Website stehen, reicht der Website-Link)", type: "textarea", placeholder: "z.B. https://www.ihre-praxis.at/leistungen\n\nOder manuell:\n- Professionelle Zahnreinigung\n- Füllungen & Kronen\n- Kieferorthopädie\n- Bleaching\n- Notfallbehandlung" },
        { key: "doctors", label: "Ärzte / Spezialisten (Namen & Fachgebiete)", type: "textarea", placeholder: "z.B.\nDr. Müller - Allgemeine Zahnheilkunde\nDr. Schmidt - Kieferorthopädie" },
        { key: "insuranceAccepted", label: "Akzeptierte Versicherungen", type: "text", placeholder: "z.B. Gesetzlich & privat, AOK, TK, Barmer, ÖGK, SVS..." },
        { key: "specialNotes", label: "Besonderheiten Ihrer Praxis?", type: "textarea", placeholder: "z.B. Kinderfreundlich, barrierefrei, Sedierung möglich, Angstpatienten willkommen..." },
      ],
    },
    {
      id: "calls",
      title: "Anrufszenarien",
      icon: "📞",
      fields: [
        { key: "callerReasons", label: "Warum rufen Patienten typischerweise an? (alle zutreffenden auswählen)", type: "multiselect", options: ["Termin vereinbaren", "Termin verschieben / absagen", "Fragen zu Leistungen & Preisen", "Notfall / Akutbehandlung", "Versicherung & Abrechnung", "Öffnungszeiten & Anfahrt", "Rezept / Überweisung", "Befunde / Nachsorge", "Allgemeine Fragen"] },
        { key: "callerReasonsOther", label: "Weitere häufige Anrufgründe?", type: "text", placeholder: "z.B. Nachfragen nach OPs, Rückrufbitten..." },
        { key: "infoToCollect", label: "Welche Informationen soll der Agent erfassen?", type: "multiselect", options: ["Vollständiger Name", "Geburtsdatum", "Telefonnummer", "E-Mail-Adresse", "Versicherungsdaten", "Wunschärzt/in", "Wunschtermin", "Grund des Besuchs", "Bestandspatient (ja/nein)"] },
        { key: "infoToCollectOther", label: "Weitere Informationen erfassen?", type: "text", placeholder: "z.B. Patientennummer, Überweiser..." },
      ],
    },
    {
      id: "objections",
      title: "Häufige Fragen & Einwände",
      icon: "❓",
      fields: [
        { key: "faq1", label: "FAQ #1 — Frage", type: "text", placeholder: "z.B. Was kostet eine professionelle Zahnreinigung?" },
        { key: "faq1Answer", label: "FAQ #1 — Wie soll der Agent antworten?", type: "textarea", placeholder: "z.B. Die Kosten hängen von der Versicherung ab. Eine Zahnreinigung kostet ab..." },
        { key: "faq2", label: "FAQ #2 — Frage", type: "text", placeholder: "z.B. Nehmen Sie neue Patienten auf?" },
        { key: "faq2Answer", label: "FAQ #2 — Wie soll der Agent antworten?", type: "textarea", placeholder: "" },
        { key: "faq3", label: "FAQ #3 — Frage", type: "text", placeholder: "z.B. Was mache ich bei einem Zahnnotfall?" },
        { key: "faq3Answer", label: "FAQ #3 — Wie soll der Agent antworten?", type: "textarea", placeholder: "" },
        { key: "topObjection", label: "Häufigster Einwand / häufigste Unsicherheit von Anrufern?", type: "textarea", placeholder: "z.B. 'Ich habe Angst vor dem Zahnarzt' → Agent soll über schonende Behandlung beruhigen..." },
        { key: "boundaryTopics", label: "Themen, die der Agent NICHT bearbeiten soll (Weiterleitung an Personal)?", type: "textarea", placeholder: "z.B. Detaillierte medizinische Beratung, Preisverhandlungen, Beschwerden..." },
      ],
    },
    {
      id: "technical",
      title: "Technik & Abläufe",
      icon: "⚙️",
      fields: [
        { key: "hasCRM", label: "Nutzen Sie ein CRM oder Praxisverwaltungssystem?", type: "select", options: ["Ja", "Nein"] },
        { key: "crmName", label: "Welches System?", type: "select", options: ["Doctolib", "Jameda", "Dr. Flex", "Dentally", "Dampsoft", "Google Calendar", "HubSpot", "Salesforce", "Anderes"], conditional: (data) => data.hasCRM === "Ja" },
        { key: "crmNameOther", label: "Falls Anderes, welches System?", type: "text", placeholder: "z.B. Calendly, eigenes System...", conditional: (data) => data.hasCRM === "Ja" && data.crmName === "Anderes" },
        { key: "bookingSystem", label: "Nutzen Sie ein separates Buchungssystem?", type: "select", options: ["Ja — dasselbe wie CRM", "Ja — separates System", "Nein — Agent soll nur Infos erfassen"] },
        { key: "bookingSystemName", label: "Welches Buchungssystem?", type: "text", placeholder: "z.B. Calendly, Cal.com, Acuity...", conditional: (data) => data.bookingSystem === "Ja — separates System" },
        { key: "sendConfirmation", label: "Soll der Agent Terminbestätigungen an Patienten senden?", type: "select", options: ["Ja", "Nein"] },
        { key: "confirmationMethod", label: "Wie sollen Bestätigungen gesendet werden? (alle zutreffenden auswählen)", type: "multiselect", options: ["WhatsApp", "SMS", "E-Mail"], conditional: (data) => data.sendConfirmation === "Ja" },
        { key: "sendReminders", label: "Soll der Agent Terminerinnerungen senden?", type: "select", options: ["Ja", "Nein"], conditional: (data) => data.sendConfirmation === "Ja" },
        { key: "reminderTiming", label: "Wann sollen Erinnerungen gesendet werden?", type: "multiselect", options: ["24 Stunden vorher", "2 Stunden vorher", "Am Morgen des Termins", "Vorabend um 18 Uhr"], conditional: (data) => data.sendConfirmation === "Ja" && data.sendReminders === "Ja" },
        { key: "afterHoursBehavior", label: "Was soll passieren, wenn außerhalb der Öffnungszeiten angerufen wird?", type: "select", options: ["Nachricht aufnehmen", "An Notfallnummer weiterleiten", "Öffnungszeiten nennen & um Rückruf bitten", "Rückruf-Termin anbieten"] },
        { key: "emergencyNumber", label: "Notfall- / Bereitschaftsnummer", type: "text", placeholder: "z.B. +49 123 456 789", conditional: (data) => data.afterHoursBehavior === "An Notfallnummer weiterleiten" },
        { key: "additionalNotes", label: "Gibt es sonst noch etwas, das wir wissen sollten?", type: "textarea", placeholder: "Besondere Abläufe, Integrationen oder Anforderungen..." },
      ],
    },
  ],
};

const MultiSelect = ({ options, selected = [], onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {options.map((opt) => {
      const isSelected = selected.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(isSelected ? selected.filter((s) => s !== opt) : [...selected, opt])}
          style={{
            padding: "8px 16px",
            borderRadius: "100px",
            border: isSelected ? "2px solid #1a5c3a" : "2px solid #d0d5d1",
            background: isSelected ? "#e8f5ee" : "#fafbfa",
            color: isSelected ? "#1a5c3a" : "#4a5550",
            fontSize: "14px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: isSelected ? 600 : 400,
            transition: "all 0.2s ease",
          }}
        >
          {isSelected && "✓ "}{opt}
        </button>
      );
    })}
  </div>
);

export default function ClinicOnboarding() {
  const [lang, setLang] = useState("en");
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const t = T[lang];
  const sections = SECTIONS[lang];

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const switchLang = (newLang) => {
    setLang(newLang);
    setFormData({});
    setCurrentSection(0);
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { _formType: t.formType, _language: lang.toUpperCase() };
      sections.forEach((sec) => {
        sec.fields
          .filter((f) => !f.conditional || f.conditional(formData))
          .forEach((f) => {
            const val = formData[f.key];
            if (val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "")) {
              payload[f.label] = Array.isArray(val) ? val.join(", ") : val;
            }
          });
      });
      await fetch("https://formspree.io/f/mnjbqvey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch (err) {
      alert(t.errorMsg);
    }
    setSubmitting(false);
  };

  const goTo = (idx) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSection(idx);
      setAnimating(false);
    }, 200);
  };

  const section = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  const allFields = sections.flatMap((s) =>
    s.fields.filter((f) => !f.conditional || f.conditional(formData))
  );
  const filledFields = allFields.filter((f) => {
    const val = formData[f.key];
    return val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "");
  }).length;

  const LangToggle = () => (
    <div style={{ display: "flex", gap: "4px", background: "#e8f5ee", borderRadius: "8px", padding: "3px" }}>
      {[{ code: "en", label: "EN 🇬🇧" }, { code: "de", label: "DE 🇩🇪" }].map((l) => (
        <button
          key={l.code}
          onClick={() => switchLang(l.code)}
          style={{
            padding: "6px 14px",
            borderRadius: "6px",
            border: "none",
            background: lang === l.code ? "#1a5c3a" : "transparent",
            color: lang === l.code ? "#fff" : "#6b7280",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s ease",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #f0f7f2 0%, #e3ede6 40%, #d6e5da 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "24px",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
        <div style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "60px 48px",
          maxWidth: "560px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(26,92,58,0.08)",
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}><LangToggle /></div>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#1a3a2a", marginBottom: "12px" }}>
            {t.completed}
          </h2>
          <p style={{ color: "#5a6b60", fontSize: "16px", lineHeight: 1.6, marginBottom: "32px" }}>
            {t.completedSub(filledFields, allFields.length)}
          </p>
          <div style={{
            background: "#f5f8f6",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "left",
            maxHeight: "400px",
            overflowY: "auto",
          }}>
            {sections.map((sec) => (
              <div key={sec.id} style={{ marginBottom: "20px" }}>
                <h4 style={{ color: "#1a5c3a", fontSize: "14px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {sec.icon} {sec.title}
                </h4>
                {sec.fields
                  .filter((f) => !f.conditional || f.conditional(formData))
                  .filter((f) => {
                    const val = formData[f.key];
                    return val && (Array.isArray(val) ? val.length > 0 : val.trim?.() !== "");
                  })
                  .map((f) => (
                    <div key={f.key} style={{ marginBottom: "6px", fontSize: "13px" }}>
                      <span style={{ color: "#7a8a80", fontWeight: 500 }}>{f.label}:</span>{" "}
                      <span style={{ color: "#2a3a30" }}>
                        {Array.isArray(formData[f.key]) ? formData[f.key].join(", ") : formData[f.key]}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setCurrentSection(0); }}
            style={{
              marginTop: "24px", padding: "14px 32px", background: "#1a5c3a",
              color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px",
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {t.editAnswers}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #f0f7f2 0%, #e3ede6 40%, #d6e5da 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      <div style={{
        padding: "28px 32px 20px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "26px",
            color: "#1a3a2a", margin: 0, fontWeight: 700,
          }}>
            {t.pageTitle}
          </h1>
          <p style={{ color: "#6a7b70", fontSize: "14px", margin: "6px 0 0" }}>{t.pageSubtitle}</p>
        </div>
        <LangToggle />
      </div>

      <div style={{ padding: "0 32px", marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
            {t.step} {currentSection + 1} {t.of} {sections.length}
          </span>
          <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
            {filledFields} / {allFields.length} {t.filled}
          </span>
        </div>
        <div style={{ height: "4px", background: "#c8d6cc", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "linear-gradient(90deg, #1a5c3a, #2d8a5e)",
            borderRadius: "4px", transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "6px", padding: "12px 32px", overflowX: "auto", flexWrap: "nowrap" }}>
        {sections.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            style={{
              padding: "10px 18px", borderRadius: "10px", border: "none",
              background: i === currentSection ? "#1a5c3a" : "#fff",
              color: i === currentSection ? "#fff" : "#4a5a50",
              fontSize: "13px", fontWeight: i === currentSection ? 600 : 500,
              cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: i === currentSection ? "0 4px 12px rgba(26,92,58,0.2)" : "0 1px 4px rgba(0,0,0,0.04)",
              transition: "all 0.25s ease",
            }}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      <div style={{
        flex: 1, padding: "16px 32px 32px",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(8px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}>
        <div style={{
          background: "#fff", borderRadius: "20px", padding: "36px 32px",
          boxShadow: "0 4px 24px rgba(26,92,58,0.06)", maxWidth: "720px",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "22px",
            color: "#1a3a2a", marginTop: 0, marginBottom: "28px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ fontSize: "28px" }}>{section.icon}</span>
            {section.title}
          </h2>

          {section.fields
            .filter((f) => !f.conditional || f.conditional(formData))
            .map((field) => (
              <div key={field.key} style={{ marginBottom: "22px" }}>
                <label style={{
                  display: "block", fontSize: "14px", fontWeight: 600,
                  color: "#2a3a30", marginBottom: "8px",
                }}>
                  {field.label}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: "10px",
                      border: "2px solid #d8ddd9", fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif", background: "#fafbfa",
                      outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1a5c3a")}
                    onBlur={(e) => (e.target.style.borderColor = "#d8ddd9")}
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: "10px",
                      border: "2px solid #d8ddd9", fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif", background: "#fafbfa",
                      outline: "none", resize: "vertical", boxSizing: "border-box",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1a5c3a")}
                    onBlur={(e) => (e.target.style.borderColor = "#d8ddd9")}
                  />
                )}

                {field.type === "select" && (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: "10px",
                      border: "2px solid #d8ddd9", fontSize: "15px",
                      fontFamily: "'DM Sans', sans-serif", background: "#fafbfa",
                      outline: "none", cursor: "pointer", boxSizing: "border-box",
                    }}
                  >
                    <option value="">{t.selectPlaceholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === "multiselect" && (
                  <MultiSelect
                    options={field.options}
                    selected={formData[field.key] || []}
                    onChange={(val) => updateField(field.key, val)}
                  />
                )}
              </div>
            ))}

          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: "32px", gap: "12px",
          }}>
            <button
              onClick={() => goTo(currentSection - 1)}
              disabled={currentSection === 0}
              style={{
                padding: "14px 28px", borderRadius: "12px",
                border: "2px solid #d0d5d1", background: "#fff",
                color: currentSection === 0 ? "#bbb" : "#3a4a40",
                fontSize: "15px", fontWeight: 600,
                cursor: currentSection === 0 ? "default" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                opacity: currentSection === 0 ? 0.4 : 1,
              }}
            >
              {t.back}
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={() => goTo(currentSection + 1)}
                style={{
                  padding: "14px 32px", borderRadius: "12px", border: "none",
                  background: "linear-gradient(135deg, #1a5c3a, #2d8a5e)",
                  color: "#fff", fontSize: "15px", fontWeight: 600,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 12px rgba(26,92,58,0.25)",
                }}
              >
                {t.next}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: "14px 36px", borderRadius: "12px", border: "none",
                  background: submitting ? "#88b89a" : "linear-gradient(135deg, #1a5c3a, #1a7a4a)",
                  color: "#fff", fontSize: "15px", fontWeight: 700,
                  cursor: submitting ? "wait" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 16px rgba(26,92,58,0.3)",
                }}
              >
                {submitting ? t.submitting : t.submit}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
