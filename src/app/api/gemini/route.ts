import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Usar a API REST diretamente para evitar problemas com a biblioteca
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Usar especificamente o modelo Gemini 2.5 Flash-Lite
    const availableModel = 'gemini-2.0-flash-exp';
    console.log('Usando modelo:', availableModel);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${availableModel}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é um assistente útil. Responda em português de forma clara e concisa.\n\nPergunta: ${message}`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro da API Gemini:', errorData);
      return NextResponse.json(
        { error: `Erro da API Gemini: ${response.status} - ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return NextResponse.json(
        { error: 'Resposta inválida da API Gemini' },
        { status: 500 }
      );
    }

    const text = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      response: text,
      model: availableModel
    });

  } catch (error) {
    console.error('Erro no servidor:', error);
    
    // Tratamento específico para erros de modelo
    if (error instanceof Error && error.message.includes('404 Not Found')) {
      return NextResponse.json(
        { error: 'Modelo não encontrado ou sem acesso. Verifique se a API key tem permissões adequadas.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error instanceof Error ? error.message : 'Erro desconhecido'}` },
      { status: 500 }
    );
  }
}
