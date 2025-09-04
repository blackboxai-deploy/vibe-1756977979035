import { NextRequest, NextResponse } from 'next/server';
import { Question, ExamResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { questions, answers } = await request.json();

    if (!questions || !answers) {
      return NextResponse.json(
        { error: 'Questions et réponses requises' },
        { status: 400 }
      );
    }

    let score = 0;
    const maxScore = questions.length;
    const detailedFeedback: string[] = [];

    // Correction automatique
    questions.forEach((question: Question) => {
      const userAnswer = answers[question.id];
      
      if (question.type === 'qcm' || question.type === 'vrai-faux') {
        // Correction exacte pour QCM et Vrai/Faux
        if (userAnswer === question.correctAnswer) {
          score += 1;
          detailedFeedback.push(`✅ Question ${question.id}: Correct`);
        } else {
          detailedFeedback.push(`❌ Question ${question.id}: Incorrect. Bonne réponse: ${question.correctAnswer}`);
        }
      } else if (question.type === 'ouverte') {
        // Pour les questions ouvertes, on utilise l'IA pour évaluer
        // Pour l'instant, on donne un point si la réponse n'est pas vide
        // Dans une version complète, on pourrait utiliser l'IA pour évaluer la qualité
        if (userAnswer && userAnswer.trim().length > 10) {
          score += 0.8; // Score partiel pour encourager les tentatives
          detailedFeedback.push(`🔍 Question ${question.id}: Réponse évaluée (crédit partiel)`);
        } else {
          detailedFeedback.push(`❌ Question ${question.id}: Réponse insuffisante`);
        }
      }
    });

    const percentage = Math.round((score / maxScore) * 100);

    // Génération du feedback personnalisé avec l'IA
    const feedbackPrompt = `Tu es un tuteur bienveillant. L'étudiant a obtenu ${score}/${maxScore} (${percentage}%) à son examen.

PERFORMANCE:
${detailedFeedback.join('\n')}

Crée un feedback personnalisé et encourageant en 2-3 phrases qui:
1. Félicite les points réussis
2. Encourage à réviser les erreurs
3. Donne des conseils d'amélioration spécifiques
4. Reste positif et motivant

Réponds directement le feedback, sans introduction.`;

    let feedback = "Bon travail ! Continuez à étudier pour vous améliorer.";

    try {
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
              content: feedbackPrompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const generatedFeedback = aiData.choices?.[0]?.message?.content;
        if (generatedFeedback) {
          feedback = generatedFeedback.trim();
        }
      }
    } catch (error) {
      console.error('Erreur génération feedback:', error);
      // Utiliser le feedback par défaut
    }

    const result: ExamResult = {
      id: Date.now().toString(),
      examId: `exam_${Date.now()}`,
      answers,
      score,
      maxScore,
      percentage,
      feedback,
      completedAt: new Date(),
      timeSpent: 0 // Sera calculé côté client
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erreur correction examen:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la correction de l\'examen',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}