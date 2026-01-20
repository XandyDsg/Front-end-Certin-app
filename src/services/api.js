
// Mudamos para 127.0.0.1 para alinhar com o padrão do servidor local
const BASE_URL = import.meta.env.VITE_API_URL; 

export async function apiFetch(endpoint, options = {}) {
  // Buscamos o token que salvamos no Login.jsx
  const token = localStorage.getItem("certin_token");

  // Configuramos os headers padrão
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Se o usuário estiver logado, adicionamos o Token no cabeçalho
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Garantimos que o endpoint comece com / para não quebrar a URL final
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  const url = `${BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Tratamento de erro 401 (Token expirado ou inválido)
    if (response.status === 401) {
      localStorage.removeItem("certin_token");
      localStorage.removeItem("certin_user");
      // Opcional: window.location.href = "/"; // Redireciona para login se o token cair
    }

    if (!response.ok) {
      // Tenta pegar a mensagem de erro detalhada que o FastAPI envia no 'detail'
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Erro ${response.status}: Falha na requisição`);
    }

    // Para evitar erro de sintaxe ao tentar dar .json() em respostas vazias (como DELETE ou 204)
    if (response.status === 204) return null;
    
    return await response.json();

  } catch (error) {
    console.error("Erro no apiFetch:", error.message);
    throw error;
  }
}