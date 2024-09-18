"use client"; // Esto indica que el componente es un Client Component

import { useState, useEffect } from "react";

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
      { name: "Jumping Jacks ", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWE5YjFpbjkxMm9yMTVkczdnb2ZldGNqdGo1M3JlYnEybW41ejFmeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/icP8phcZOQ7kM99i0T/giphy.gif" },
      { name: "High Knees", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGMzeThwZ2E4YXN1ZDFsOHFxYmdiZWs2NXY5cnNmdnlnbmcwanM3aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlNOsSRC0Bts7iU/giphy.gif" },
      { name: "Burpees", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTB4eHcxcWdoeDFxem1qNTgxOHJ4cjVxc3RhZ3d1czJ1NmF3OGc4ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MWpR0DEX7ZcgHqsHec/giphy.gif" },
    ],
    strength: [
      { name: "Push-ups", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHBycjN0OGd0YTgxcDlpejgzb3A2emEzNHFkOGlnemtwZHhneXdybSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mGWBjz74fn404BWUl4/giphy.gif" },
      { name: "Squats", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGh4bnBjdjNnYXZ3azIwOWEzMTNodzF6bGI4Y2x4MnlidGFqeTJrbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3NwOzakbqzOrsfMKBC/giphy.gif" },
      { name: "Planks", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTd4NnE5cWt5MTdwN3RpZDhjdHhwaG54MHo2ODR2YWp1YWtqd3BscyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZcteOOkovIh9HaVFjT/giphy-downsized-large.gif" },
    ],
    flexibility: [
      { name: "Toe Touch", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTM5ejQ4ZmJuNXBnZWtncWh5MzZ5dzNrNGl4ZTY3aG4zNDFyNnM4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xWYomAYxOIPL5JfhNT/giphy.gif" },
      { name: "Cat-Cow Stretch", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGRqZnFpYjF3MGppbjg0azNzZHcxd2UyaWhhbDY5NnJwdm9rbW02NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JdtyfG3ZSE8iOlDs64/giphy.gif" },
      { name: "Child's Pose", gifUrl: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOW1wMHUxa2h3YjRsdHNuc3d5MDd0aWx1ZGhqdXd4Z3ZhYjFhcDhwMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/A7eqrnTXE35xKaMDS3/giphy.gif" },
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
          <label className="block mb-2 text-lg">Tipo de ejercicio:</label>
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
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
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
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="30"
            min="10"
            max="60"
          />

          <label className="block mb-2 text-lg">Repeticiones:</label>
          <input
            type="number"
            name="repetitions"
            value={formData.repetitions}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="10"
            min="1"
          />

          <label className="block mb-2 text-lg">Series:</label>
          <input
            type="number"
            name="sets"
            value={formData.sets}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="3"
            min="1"
          />

          <label className="block mb-2 text-lg">Objetivo:</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="general">General</option>
            <option value="weightLoss">Pérdida de Peso</option>
            <option value="muscleGain">Ganancia Muscular</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600"
          >
            Generar Rutina
          </button>
        </form>
      ) : (
        <ul className="bg-white p-6 rounded-lg shadow-md w-96 text-black">
          <h2 className="text-2xl font-bold mb-4">Tu Rutina</h2>
          {routine.map((exercise, index) => (
            <li key={index} className="mb-4">
              <p className="text-lg">{exercise.name}</p>
              <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-auto rounded-md" />
            </li>
          ))}
          <button
            onClick={() => setRoutine([])}
            className="bg-red-500 text-white w-full p-2 rounded-md hover:bg-red-600 mt-4"
          >
            Generar Nueva Rutina
          </button>
        </ul>
      )}
    </div>
  );
}
