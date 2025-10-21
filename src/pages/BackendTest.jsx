import React, { useState } from 'react';
import Logo from '../components/Logo';

const BackendTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testBackend = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('https://localhost:5001/api/v1/auth/login', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:5173'
        }
      });

      setTestResult({
        success: true,
        message: '✅ Conexión exitosa con el backend',
        status: response.status
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: '❌ No se puede conectar con el backend',
        error: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const openBackend = () => {
    window.open('https://localhost:5001/swagger', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <Logo height="60px" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          🔧 Prueba de Conexión con Backend
        </h1>

        <div className="space-y-6">
          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Pasos para conectar:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Asegúrate de que tu backend esté corriendo</li>
              <li>Haz clic en "Abrir Backend" para aceptar el certificado SSL</li>
              <li>Acepta la advertencia de seguridad en el navegador</li>
              <li>Vuelve a esta página y haz clic en "Probar Conexión"</li>
            </ol>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={openBackend}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              🌐 Abrir Backend (Swagger)
            </button>
            <button
              onClick={testBackend}
              disabled={testing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {testing ? '⏳ Probando...' : '🧪 Probar Conexión'}
            </button>
          </div>

          {/* Resultado */}
          {testResult && (
            <div className={`rounded-lg p-4 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-semibold mb-2 ${testResult.success ? 'text-green-900' : 'text-red-900'}`}>
                {testResult.message}
              </h3>
              {testResult.error && (
                <p className="text-sm text-red-700 mt-2">
                  Error: {testResult.error}
                </p>
              )}
              {testResult.success && (
                <p className="text-sm text-green-700 mt-2">
                  Estado HTTP: {testResult.status}
                </p>
              )}
            </div>
          )}

          {/* Información adicional */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <h3 className="font-semibold text-gray-900 mb-2">ℹ️ Información:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Backend URL: <code className="bg-gray-200 px-1 rounded">https://localhost:5001</code></li>
              <li>• Frontend URL: <code className="bg-gray-200 px-1 rounded">http://localhost:5173</code></li>
              <li>• CORS debe permitir el origen del frontend</li>
            </ul>
          </div>

          {/* Configuración CORS */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Configuración CORS requerida:</h3>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
{`builder.Services.AddCors(options =>
{
    options.AddPolicy("AdoPetsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

app.UseCors("AdoPetsPolicy");`}
            </pre>
          </div>

          {/* Botón volver */}
          <div className="text-center">
            <a
              href="/"
              className="inline-block text-primary hover:text-primary-dark font-medium"
            >
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendTest;
