import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">404</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Página no encontrada</p>
      <Link
        to="/"
        className="mt-6 text-blue-600 dark:text-blue-400 hover:underline text-sm"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
