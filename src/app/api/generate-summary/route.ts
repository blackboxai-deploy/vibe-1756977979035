import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, subject, level } = await request.json();

    if (!content || !subject || !level) {
      return NextResponse.json(
        { error: 'Contenu, matière et niveau requis' },
        { status: 400 }
      );
    }

    // Configuration des longueurs selon le niveau
    const lengthInstructions = {
      court: "en 100-200 mots maximum",
      moyen: "en 300-500 mots",
      detaille: "en 600 mots ou plus avec tous les détails importants"
    };

    // Prompt personnalisé selon la matière
    const subjectPrompts: Record<string, string> = {
      math: "Concentre-toi sur les formules, théorèmes et méthodes de résolution.",
      sciences: "Mets l'accent sur les concepts scientifiques, expériences et phénomènes.",
      francais: "Souligne les éléments littéraires, grammaticaux et stylistiques.",
      histoire: "Organise chronologiquement les événements, dates et personnages clés.",
      geographie: "Structure par régions, climat, populations et ressources.",
      anglais: "Inclus le vocabulaire clé, structures grammaticales et expressions.",
      art: "Décris les techniques, styles artistiques et contexte historique.",
      sport: "Couvre les règles, techniques, bénéfices santé et aspects tactiques."
    };

    const prompt = `Tu es un assistant éducatif expert. Crée un résumé structuré et pédagogique du contenu suivant.

MATIÈRE: ${subject}
NIVEAU DE DÉTAIL: ${level} (${lengthInstructions[level as keyof typeof lengthInstructions]})

INSTRUCTIONS SPÉCIFIQUES:
${subjectPrompts[subject] || "Organise le contenu de manière claire et éducative."}

CONTENU À RÉSUMER:
${content}

STRUCTURE ATTENDUE:
1. Commencer par une phrase d'introduction
2. Organiser en points clés avec des sous-sections si nécessaire
3. Utiliser des exemples concrets
4. Terminer par une conclusion synthétique
5. Utiliser un langage adapté aux étudiants

FORMAT: Texte structuré avec des sauts de ligne et une présentation claire.`;

    // Appel à l'API IA via l'endpoint personnalisé
    const aiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_Rm8BMrUUnJsXep',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: level === 'detaille' ? 1000 : level === 'moyen' ? 700 : 400,
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`Erreur API IA: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const summary = aiData.choices?.[0]?.message?.content;

    if (!summary) {
      throw new Error('Aucun résumé généré par l\'IA');
    }

    return NextResponse.json({
      success: true,
      summary: summary.trim(),
      metadata: {
        subject,
        level,
        originalLength: content.length,
        summaryLength: summary.length,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur génération résumé:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du résumé',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}