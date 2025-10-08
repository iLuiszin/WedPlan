'use client';

import { useState } from 'react';
import { useUpdateProject } from '@/hooks/use-project';
import { useModal } from '@/contexts/modal-context';
import type { IProject } from '@/models/project';

interface ProjectDetailsCardProps {
  project: IProject;
}

export function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  const [isEditingBride, setIsEditingBride] = useState(false);
  const [isEditingGroom, setIsEditingGroom] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  const [brideFirstName, setBrideFirstName] = useState(project.brideFirstName);
  const [brideLastName, setBrideLastName] = useState(project.brideLastName);
  const [groomFirstName, setGroomFirstName] = useState(project.groomFirstName);
  const [groomLastName, setGroomLastName] = useState(project.groomLastName);
  const [weddingDate, setWeddingDate] = useState(
    project.weddingDate
      ? new Date(project.weddingDate).toISOString().split('T')[0]
      : ''
  );

  const updateProject = useUpdateProject();
  const { showAlert } = useModal();

  const handleBrideSave = async () => {
    if (!brideFirstName.trim() || !brideLastName.trim()) {
      await showAlert({ message: 'Nome e sobrenome da noiva são obrigatórios' });
      return;
    }

    await updateProject.mutateAsync({
      _id: project._id.toString(),
      brideFirstName: brideFirstName.trim(),
      brideLastName: brideLastName.trim(),
    });
    setIsEditingBride(false);
  };

  const handleBrideCancel = () => {
    setBrideFirstName(project.brideFirstName);
    setBrideLastName(project.brideLastName);
    setIsEditingBride(false);
  };

  const handleGroomSave = async () => {
    if (!groomFirstName.trim() || !groomLastName.trim()) {
      await showAlert({ message: 'Nome e sobrenome do noivo são obrigatórios' });
      return;
    }

    await updateProject.mutateAsync({
      _id: project._id.toString(),
      groomFirstName: groomFirstName.trim(),
      groomLastName: groomLastName.trim(),
    });
    setIsEditingGroom(false);
  };

  const handleGroomCancel = () => {
    setGroomFirstName(project.groomFirstName);
    setGroomLastName(project.groomLastName);
    setIsEditingGroom(false);
  };

  const handleDateSave = async () => {
    await updateProject.mutateAsync({
      _id: project._id.toString(),
      weddingDate: weddingDate ? new Date(weddingDate + 'T12:00:00.000Z') : null,
    });
    setIsEditingDate(false);
  };

  const handleDateCancel = () => {
    setWeddingDate(
      project.weddingDate
        ? new Date(project.weddingDate).toISOString().split('T')[0]
        : ''
    );
    setIsEditingDate(false);
  };

  const formattedDate = project.weddingDate
    ? new Date(project.weddingDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : 'Data não definida';

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {project.brideFirstName} & {project.groomFirstName}
        </h1>

        {isEditingDate ? (
          <div className="flex items-center justify-center gap-2 mt-2">
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleDateSave}
              className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
            >
              Salvar
            </button>
            <button
              onClick={handleDateCancel}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <p
            onClick={() => setIsEditingDate(true)}
            className="text-lg text-gray-600 cursor-pointer hover:text-primary transition inline-flex items-center gap-1"
            title="Clique para editar a data"
          >
            {formattedDate}
            <svg
              className="w-4 h-4 opacity-0 hover:opacity-100 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </p>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {/* Bride Card */}
        <div className="p-4 bg-pink-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Noiva</p>
          {isEditingBride ? (
            <div className="space-y-2">
              <input
                type="text"
                value={brideFirstName}
                onChange={(e) => setBrideFirstName(e.target.value)}
                placeholder="Nome"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={brideLastName}
                onChange={(e) => setBrideLastName(e.target.value)}
                placeholder="Sobrenome"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleBrideSave}
                  className="flex-1 px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
                >
                  Salvar
                </button>
                <button
                  onClick={handleBrideCancel}
                  className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p
              onClick={() => setIsEditingBride(true)}
              className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-primary transition group inline-flex items-center gap-1"
              title="Clique para editar"
            >
              {project.brideFirstName} {project.brideLastName}
              <svg
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </p>
          )}
        </div>

        {/* Groom Card */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Noivo</p>
          {isEditingGroom ? (
            <div className="space-y-2">
              <input
                type="text"
                value={groomFirstName}
                onChange={(e) => setGroomFirstName(e.target.value)}
                placeholder="Nome"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                autoFocus
              />
              <input
                type="text"
                value={groomLastName}
                onChange={(e) => setGroomLastName(e.target.value)}
                placeholder="Sobrenome"
                className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleGroomSave}
                  className="flex-1 px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
                >
                  Salvar
                </button>
                <button
                  onClick={handleGroomCancel}
                  className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p
              onClick={() => setIsEditingGroom(true)}
              className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-primary transition group inline-flex items-center gap-1"
              title="Clique para editar"
            >
              {project.groomFirstName} {project.groomLastName}
              <svg
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
