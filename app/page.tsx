"use client"; // Esto indica que el componente es un Client Component

import { useState } from "react";
import Image from 'next/image';

// Interfaz para definir el tipo de dato del formulario
interface ExerciseForm {
  type: string;
  level: string;
  duration: number;
  repetitions: number;
  sets: number;
  goal: string;
}

interface Exercise {
  name: string;
  gifUrl: string;
}

export default function Home() {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState<ExerciseForm>({
    type: "cardio",
    level: "principiante",
    duration: 30,
    repetitions: 10,
    sets: 3,
    goal: "general",
  });

  // Estado para almacenar la rutina generada
  const [routine, setRoutine] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Ejercicios con sus GIFs correspondientes
  const exerciseData: { [key: string]: Exercise[] } = {
    cardio: [
      { name: "Jumping Jacks", gifUrl: "/gifs/jumping jacks.gif" },
      { name: "High Knees", gifUrl: "/gifs/high knees.gif" },
      { name: "Burpees", gifUrl: "/gifs/burpees.gif" },
    ],
    strength: [
      { name: "Push-ups", gifUrl: "/gifs/push ups.gif" },
      { name: "Squats", gifUrl: "/gifs/squats.gif" },
      { name: "Planks", gifUrl: "/gifs/planks.gif" },
    ],
    flexibility: [
      { name: "Toe Touch", gifUrl: "/gifs/toe touch.gif" },
      { name: "Cat-Cow Stretch", gifUrl: "/gifs/cat cow stretch.gif" },
      { name: "Child's Pose", gifUrl: "/gifs/child's pose.gif" },
    ],
  };

  // Maneja los cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "duration" || name === "repetitions" || name === "sets" ? Number(value) : value,
    }));
  };

  // Genera la rutina con base en el tipo de ejercicio, nivel, duración, repeticiones, series y objetivo
  const generateRoutine = (type: string, level: string, duration: number, repetitions: number, sets: number, goal: string): Exercise[] => {
    // Ajusta los ejercicios según el objetivo y el nivel
    const adjustedExercises = goal === "weightLoss" ? exerciseData[type].slice(0, Math.floor(duration / 10)) : exerciseData[type];
    const adjustedForLevel = adjustedExercises.map((exercise) => ({
      ...exercise,
      name:
        level === "avanzado"
          ? `${exercise.name}: ${sets} sets of ${repetitions + 5} reps`
          : level === "intermedio"
          ? `${exercise.name}: ${sets} sets of ${repetitions + 2} reps`
          : `${exercise.name}: ${sets} sets of ${repetitions} reps`,
    }));

    return adjustedForLevel;
  };

  // Maneja el envío del formulario y genera la rutina
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.duration < 10 || formData.duration > 60) {
      setError("La duración debe estar entre 10 y 60 minutos.");
      return;
    }

    setError(null);
    const { type, level, duration, repetitions, sets, goal } = formData;
    const generatedRoutine = generateRoutine(type, level, duration, repetitions, sets, goal);
    setRoutine(generatedRoutine);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">Generador de Rutinas de Ejercicio</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {routine.length === 0 ? (
        <form onSubmit={handleSubmit} className="bg-gray-300 p-6 rounded-lg shadow-md w-96 text-black">
          {/* Form fields */}
          <label className="block mb-2 text-lg">Tipo de Ejercicio:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
          >
            <option value="cardio">Cardio</option>
            <option value="strength">Fuerza</option>
            <option value="flexibility">Flexibilidad</option>
          </select>

          <label className="block mb-2 text-lg">Nivel:</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
          >
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>

          <label className="block mb-2 text-lg">Duración (minutos):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
            min="10"
            max="60"
          />

          <label className="block mb-2 text-lg">Repeticiones:</label>
          <input
            type="number"
            name="repetitions"
            value={formData.repetitions}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
            min="1"
          />

          <label className="block mb-2 text-lg">Series:</label>
          <input
            type="number"
            name="sets"
            value={formData.sets}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
            min="1"
          />

          <label className="block mb-2 text-lg">Objetivo:</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-black"
          >
            <option value="general">General</option>
            <option value="weightLoss">Pérdida de Peso</option>
            <option value="muscleGain">Ganancia Muscular</option>
          </select>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Generar Rutina
          </button>
        </form>
      ) : (
        <div className="w-full max-w-xl mx-auto p-4">
          <h2 className="text-3xl mb-4">Rutina Generada</h2>
          <ul>
            {routine.map((exercise, index) => (
              <li key={index} className="mb-4">
                <p className="text-xl">{exercise.name}</p>
                <Image
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </li>
            ))}
          </ul>
          <button
            onClick={() => setRoutine([])}
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Regresar
          </button>
        </div>
      )}
    </div>
  );
}