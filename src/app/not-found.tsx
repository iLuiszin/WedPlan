import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-4xl font-bold mb-4 text-gray-800">404</h2>
      <p className="text-gray-600 mb-6">Página não encontrada</p>
      <Link
        href="/guests"
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition inline-block"
      >
        Voltar para Convidados
      </Link>
    </div>
  );
}
