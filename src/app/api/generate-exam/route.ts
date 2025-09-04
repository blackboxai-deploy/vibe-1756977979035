import { NextRequest, NextResponse } from 'next/server';
import { Question } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { subject, difficulty, questionCount } = await request.json();

    if (!subject || !difficulty || !questionCount) {
      return NextResponse.json(
        { error: 'Matière, difficulté et nombre de questions requis' },
        { status: 400 }
      );
    }

    // Prompts spécialisés par matière
    const subjectPrompts: Record<string, string> = {
      math: "Crée des questions de mathématiques incluant calculs, géométrie, algèbre et résolution de problèmes.",
      sciences: "Génère des questions sur la physique, chimie, biologie avec des concepts scientifiques et expériences.",
      francais: "Pose des questions sur la grammaire, orthographe, littérature et compréhension de texte.",
      histoire: "Crée des questions sur les événements historiques, dates importantes et personnages célèbres.",
      geographie: "Génère des questions sur la géographie mondiale, climat, populations et ressources naturelles.",
      anglais: "Pose des questions sur le vocabulaire anglais, grammaire et compréhension.",
      art: "Crée des questions sur l'histoire de l'art, techniques artistiques et artistes célèbres.",
      sport: "Génère des questions sur les sports, règles, techniques et bienfaits de l'activité physique."
    };

    const difficultyInstructions = {
      facile: "Questions niveau débutant avec des concepts de base",
      moyen: "Questions niveau intermédiaire avec des applications pratiques",
      difficile: "Questions niveau avancé avec des analyses complexes"
    };

    const prompt = `Tu es un générateur d'examens éducatifs. Crée exactement ${questionCount} questions pour un examen de ${subject}.

NIVEAU: ${difficulty} (${difficultyInstructions[difficulty as keyof typeof difficultyInstructions]})
MATIÈRE: ${subjectPrompts[subject] || "Questions générales sur le sujet"}

CONSIGNES STRICTES:
1. Génère exactement ${questionCount} questions
2. Mélange les types: 60% QCM, 25% Vrai/Faux, 15% Questions ouvertes
3. Pour chaque QCM: 4 options avec UNE SEULE bonne réponse
4. Pour Vrai/Faux: une affirmation claire
5. Pour questions ouvertes: réponses en 1-3 phrases

FORMAT JSON OBLIGATOIRE:
{
  "questions": [
    {
      "id": "1",
      "type": "qcm",
      "question": "Question ici ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Explication de la bonne réponse",
      "difficulty": "${difficulty}"
    },
    {
      "id": "2", 
      "type": "vrai-faux",
      "question": "Affirmation ici",
      "correctAnswer": "vrai",
      "explanation": "Explication",
      "difficulty": "${difficulty}"
    },
    {
      "id": "3",
      "type": "ouverte", 
      "question": "Question ouverte ?",
      "correctAnswer": "Réponse type attendue",
      "explanation": "Explication des points clés",
      "difficulty": "${difficulty}"
    }
  ]
}

IMPORTANT: Répond UNIQUEMENT avec le JSON valide, sans texte supplémentaire.`;

    // Appel à l'API IA
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
        max_tokens: 2000,
        temperature: 0.8
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`Erreur API IA: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Aucune réponse de l\'IA');
    }

    // Parser le JSON de l'IA
    let questionsData;
    try {
      // Nettoyer le contenu pour ne garder que le JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      questionsData = JSON.parse(jsonContent);
    } catch (error) {
      console.error('Erreur parsing JSON:', content);
      throw new Error('Format de réponse IA invalide');
    }

    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      throw new Error('Structure de questions invalide');
    }

    // Validation et nettoyage des questions
    const cleanQuestions: Question[] = questionsData.questions.map((q: any, index: number) => ({
      id: (index + 1).toString(),
      type: q.type || 'qcm',
      question: q.question || `Question ${index + 1}`,
      options: q.type === 'qcm' ? (q.options || []) : undefined,
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || 'Pas d\'explication disponible',
      difficulty: difficulty as 'facile' | 'moyen' | 'difficile'
    }));

    return NextResponse.json({
      success: true,
      questions: cleanQuestions,
      metadata: {
        subject,
        difficulty,
        questionCount: cleanQuestions.length,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur génération examen:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération de l\'examen',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}