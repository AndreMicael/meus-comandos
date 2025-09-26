import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro ao listar modelos: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Filtrar apenas modelos Gemini que suportam generateContent
    const geminiModels = data.models?.filter((model: any) => 
      model.name?.includes('gemini') && 
      model.supportedGenerationMethods?.includes('generateContent')
    ) || [];
    
    return NextResponse.json({
      allModels: data.models,
      geminiModels: geminiModels,
      totalModels: data.models?.length || 0,
      geminiCount: geminiModels.length
    });
    
  } catch (error) {
    console.error('Erro ao listar modelos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
