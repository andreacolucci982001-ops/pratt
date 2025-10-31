import { useState } from 'react';
import { MapPin, Clock, Mic, PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SuperPratica() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'English Conversation Café',
      time: '18:30',
      day: 'Lunedì, 2025-11-07',
      address: 'Via Roma 45',
      city: 'Benevento',
      startingSoon: true,
    },
  ]);

  const [exercises, setExercises] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  const [exerciseForm, setExerciseForm] = useState({
    nome: '',
    cognome: '',
    question: '',
    audio: '',
    options: ['', ''],
    correctIndex: 0,
    theory: '',
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    place: '',
    description: '',
    city: '',
  });

  const nextId = (arr) => (arr && arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1);

  const handleAnswer = (id, selectedOptionIndex) => {
    const exercise = exercises.find((e) => e.id === id);
    if (!exercise) return;
    const correct = Number(selectedOptionIndex) === Number(exercise.correctIndex);
    setSelectedAnswers({ ...selectedAnswers, [id]: selectedOptionIndex });

    if (correct) {
      setFeedback({
        ...feedback,
        [id]: { ok: true, message: '✔️ Corretto! Guarda la spiegazione teorica sotto.', theory: exercise.theory },
      });

      setTimeout(() => {
        setExercises((prev) => {
          const remaining = prev.filter((e) => e.id !== id);
          const moved = prev.find((e) => e.id === id);
          if (!moved) return prev;
          return [...remaining, moved];
        });
      }, 4000);
    } else {
      setFeedback({ ...feedback, [id]: { ok: false, message: '❌ Non è corretto. Riprova.' } });
    }
  };

  const handleExerciseFormChange = (field, value) => {
    setExerciseForm({ ...exerciseForm, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const opts = [...exerciseForm.options];
    opts[index] = value;
    setExerciseForm({ ...exerciseForm, options: opts });
  };

  const addOption = () => {
    setExerciseForm({ ...exerciseForm, options: [...exerciseForm.options, ''] });
  };

  const removeOption = (index) => {
    const opts = exerciseForm.options.filter((_, i) => i !== index);
    let correctIndex = Number(exerciseForm.correctIndex);
    if (index < correctIndex) correctIndex = Math.max(0, correctIndex - 1);
    if (correctIndex >= opts.length) correctIndex = opts.length - 1;
    setExerciseForm({ ...exerciseForm, options: opts, correctIndex });
  };

  const submitExercise = (e) => {
    e.preventDefault();
    if (!exerciseForm.nome || !exerciseForm.cognome || !exerciseForm.question) return alert('Compila nome, cognome e domanda.');
    if (!exerciseForm.options || exerciseForm.options.length < 2) return alert('Inserisci almeno due opzioni.');

    const newEx = {
      id: nextId(exercises),
      audio: exerciseForm.audio || '',
      question: exerciseForm.question,
      author: `${exerciseForm.nome} ${exerciseForm.cognome}`,
      options: exerciseForm.options,
      correctIndex: Number(exerciseForm.correctIndex),
      theory: exerciseForm.theory || '',
    };

    setExercises([newEx, ...exercises]);
    setExerciseForm({ nome: '', cognome: '', question: '', audio: '', options: ['', ''], correctIndex: 0, theory: '' });
    setShowExerciseForm(false);
  };

  const handleEventFormChange = (field, value) => {
    setEventForm({ ...eventForm, [field]: value });
  };

  const submitEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.place || !eventForm.city)
      return alert('Compila titolo, data, ora, luogo e città.');

    const newEvent = {
      id: nextId(events),
      title: eventForm.title,
      day: eventForm.date,
      time: eventForm.time,
      address: eventForm.place,
      description: eventForm.description,
      city: eventForm.city,
      startingSoon: false,
    };

    setEvents([newEvent, ...events]);
    setEventForm({ title: '', date: '', time: '', place: '', description: '', city: '' });
  };

  const [eventCityFilter, setEventCityFilter] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800 font-sans">
      <header className="flex justify-between items-center p-6 border-b border-sky-100">
        <div className="flex flex-col">
          <h1 className="text-6xl font-extrabold text-sky-600 tracking-tight">SuperPratica</h1>
          <p className="text-3xl font-serif text-sky-500 italic mt-1 animate-pulse">Pratica ovunque, il più possibile</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowExerciseForm(!showExerciseForm)} className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-5 py-2 text-sm flex items-center gap-2">
            <PlusCircle size={18} /> Crea un esercizio
          </Button>
          <Button className="bg-white border border-sky-200 text-sky-700 rounded-full px-4 py-2 text-sm">Login</Button>
        </div>
      </header>

      <main className="grid grid-cols-3 gap-6 p-8">
        <section className="col-span-2 space-y-6">
          {showExerciseForm && (
            <Card className="mb-6 border border-sky-100 rounded-2xl">
              <CardContent className="p-4">
                <h3 className="font-bold text-sky-700 mb-2">Crea un esercizio (chiunque può creare)</h3>
                <form onSubmit={submitExercise} className="space-y-3">
                  <div className="flex gap-2">
                    <input className="border rounded-lg p-2 w-1/2" placeholder="Nome" value={exerciseForm.nome} onChange={(e) => handleExerciseFormChange('nome', e.target.value)} />
                    <input className="border rounded-lg p-2 w-1/2" placeholder="Cognome" value={exerciseForm.cognome} onChange={(e) => handleExerciseFormChange('cognome', e.target.value)} />
                  </div>
                  <input className="border rounded-lg p-2 w-full" placeholder="Domanda" value={exerciseForm.question} onChange={(e) => handleExerciseFormChange('question', e.target.value)} />
                  <input className="border rounded-lg p-2 w-full" placeholder="Link audio (opzionale)" value={exerciseForm.audio} onChange={(e) => handleExerciseFormChange('audio', e.target.value)} />
                  <div>
                    <label className="text-sm font-semibold">Opzioni (inserisci le possibili risposte)</label>
                    <div className="space-y-2 mt-2">
                      {exerciseForm.options.map((opt, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input className="border rounded-lg p-2 flex-1" value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} placeholder={`Opzione ${i + 1}`} />
                          <button type="button" className="text-sm px-2 py-1 border rounded" onClick={() => removeOption(i)} disabled={exerciseForm.options.length <= 2}>Elimina</button>
                        </div>
                      ))}
                      <div className="flex gap-2 items-center">
                        <button type="button" className="text-sm px-3 py-1 border rounded" onClick={addOption}>Aggiungi opzione</button>
                        <p className="text-xs text-gray-600">Scegli quale opzione è corretta (index):</p>
                        <select className="border rounded-lg p-2 text-sm ml-2" value={exerciseForm.correctIndex} onChange={(e) => handleExerciseFormChange('correctIndex', e.target.value)}>
                          {exerciseForm.options.map((_, i) => (
                            <option key={i} value={i}>{i + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <textarea className="border rounded-lg p-2 w-full" placeholder="Spiegazione teorica (mostrata se l'utente azzecca la risposta)" value={exerciseForm.theory} onChange={(e) => handleExerciseFormChange('theory', e.target.value)} />
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white">Pubblica esercizio</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {exercises.length === 0 && <p className="text-gray-600">Nessun esercizio disponibile. Crea il primo esercizio premendo in alto su "Crea un esercizio".</p>}

          {exercises.map((ex) => (
            <Card key={ex.id} className="shadow-md hover:shadow-lg transition-all duration-500 rounded-2xl border border-sky-100 mb-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Mic className="text-sky-600" />
                    <p className="text-sm text-gray-600">Domanda di {ex.author}</p>
                  </div>
                </div>
                {ex.audio && <audio controls className="w-full mb-4 rounded-lg"><source src={ex.audio} type="audio/mpeg" /></audio>}
                <p className="font-medium text-gray-700 text-lg mb-4">{ex.question}</p>
                <div className="space-y-2">
                  {ex.options.map((opt, i) => (
                    <Button key={i} onClick={() => handleAnswer(ex.id, i)} className="w-full justify-start bg-white border border-gray-200 rounded-lg text-left px-4 py-2 text-gray-700 hover:bg-sky-50">{opt}</Button>
                  ))}
                </div>
                {feedback[ex.id] && (
                  <div className="mt-3 text-sm font-semibold text-sky-700">
                    <p>{feedback[ex.id].message}</p>
                    {feedback[ex.id].ok && feedback[ex.id].theory && (
                      <div className="mt-2 p-3 bg-sky-50 border border-sky-100 rounded">
                        <p className="font-medium">Spiegazione teorica:</p>
                        <p className="text-sm text-gray-700">{feedback[ex.id].theory}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        <aside className="space-y-6">
          <h3 className="text-sky-700 font-semibold text-lg mb-2">Eventi</h3>
          <Card className="p-4 mb-4 border rounded-xl border-sky-100">
            <CardContent>
              <h4 className="font-semibold">Crea un evento</h4>
              <form onSubmit={submitEvent} className="space-y-2 mt-2">
                <input className="border rounded-lg p-2 w-full" placeholder="Titolo evento" value={eventForm.title} onChange={(e) => handleEventFormChange('title', e.target.value)} />
                <input type="date" className="border rounded-lg p-2 w-full" value={eventForm.date} onChange={(e) => handleEventFormChange('date', e.target.value)} />
                <input type="time" className="border rounded-lg p-2 w-full" value={eventForm.time} onChange={(e) => handleEventFormChange('time', e.target.value)} />
                <input className="border rounded-lg p-2 w-full" placeholder="Luogo" value={eventForm.place} onChange={(e) => handleEventFormChange('place', e.target.value)} />
                <input className="border rounded-lg p-2 w-full" placeholder="Città" value={eventForm.city} onChange={(e) => handleEventFormChange('city', e.target.value)} />
                <textarea className="border rounded-lg p-2 w-full" placeholder="Descrizione (includi data, luogo, orario e città)" value={eventForm.description} onChange={(e) => handleEventFormChange('description', e.target.value)} />
                <div className="flex justify-end">
                  <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white">Pubblica evento</Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="mb-4">
            <label className="text-sm text-gray-600">Filtra per città</label>
            <select className="border rounded-lg p-2 w-full mt-2" value={eventCityFilter} onChange={(e) => setEventCityFilter(e.target.value)}>
              <option value="">Tutte le città</option>
              {[...new Set(events.map((ev) => ev.city).filter(Boolean))].map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {events.filter((ev) => (eventCityFilter ? ev.city === eventCityFilter : true)).map((event) => (
            <Card key={event.id} className={`border rounded-xl ${event.startingSoon ? 'border-sky-400 shadow-md' : 'border-gray-200'} hover:shadow-lg transition-all duration-300 mb-3`}>
              <CardContent className="p-4">
                <h4 className="font-bold text-lg text-sky-700">{event.title}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-2"><Clock size={14} /> {event.day}, ore {event.time}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin size={14} /> {event.address} — {event.city}</p>
                {event.description && <p className="text-xs text-sky-600 mt-2">{event.description}</p>}
              </CardContent>
            </Card>
          ))}
          <img src="/map-placeholder.png" alt="Mappa eventi" className="w-full rounded-lg mt-4" />
        </aside>
      </main>
    </div>
  );
}
