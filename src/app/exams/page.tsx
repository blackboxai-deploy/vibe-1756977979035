"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { subjects } from "@/data/subjects";
import { Question, ExamResult } from "@/types";

interface ExamState {
  questions: Question[];
  currentQuestion: number;
  answers: Record<string, string>;
  timeLeft: number;
  isCompleted: boolean;
  result: ExamResult | null;
}

export default function ExamsPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("moyen");
  const [questionCount, setQuestionCount] = useState("10");
  const [isGenerating, setIsGenerating] = useState(false);
  const [examState, setExamState] = useState<ExamState>({
    questions: [],
    currentQuestion: 0,
    answers: {},
    timeLeft: 0,
    isCompleted: false,
    result: null
  });

  // Timer effet
  useEffect(() => {
    if (examState.timeLeft > 0 && !examState.isCompleted) {
      const timer = setTimeout(() => {
        setExamState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (examState.timeLeft === 0 && examState.questions.length > 0 && !examState.isCompleted) {
      submitExam();
    }
  }, [examState.timeLeft, examState.isCompleted]);

  const generateExam = async () => {
    if (!selectedSubject) {
      alert("Veuillez sélectionner une matière");
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: selectedSubject,
          difficulty: selectedDifficulty,
          questionCount: parseInt(questionCount)
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de l\'examen');
      }

      const data = await response.json();
      
      setExamState({
        questions: data.questions,
        currentQuestion: 0,
        answers: {},
        timeLeft: parseInt(questionCount) * 60, // 1 minute par question
        isCompleted: false,
        result: null
      });

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération de l\'examen. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setExamState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

  const nextQuestion = () => {
    if (examState.currentQuestion < examState.questions.length - 1) {
      setExamState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    }
  };

  const previousQuestion = () => {
    if (examState.currentQuestion > 0) {
      setExamState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
    }
  };

  const submitExam = async () => {
    try {
      const response = await fetch('/api/grade-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: examState.questions,
          answers: examState.answers
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la correction');
      }

      const result = await response.json();
      
      setExamState(prev => ({
        ...prev,
        isCompleted: true,
        result: result
      }));

      // Sauvegarder le résultat
      const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]');
      existingResults.push(result);
      localStorage.setItem('examResults', JSON.stringify(existingResults));

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la correction. Veuillez réessayer.');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = examState.questions[examState.currentQuestion];
  const progress = examState.questions.length > 0 
    ? ((examState.currentQuestion + 1) / examState.questions.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EcoLearn
                </span>
              </Link>
            </div>
            {examState.questions.length === 0 && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/subjects" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Matières
                </Link>
                <Link href="/summaries" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Résumés
                </Link>
                <Link href="/history" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Historique
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Configuration de l'examen */}
        {examState.questions.length === 0 && !examState.isCompleted && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Examens Adaptatifs IA
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Générez des examens personnalisés et testez vos connaissances avec une correction automatique
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>⚙️</span>
                    <span>Configuration de l'examen</span>
                  </CardTitle>
                  <CardDescription>
                    Personnalisez votre examen selon vos besoins d'apprentissage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Subject Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Matière</label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une matière" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.icon} {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Difficulty Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Niveau de difficulté</label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facile">🟢 Facile</SelectItem>
                        <SelectItem value="moyen">🟡 Moyen</SelectItem>
                        <SelectItem value="difficile">🔴 Difficile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Count */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Nombre de questions (Durée estimée: {parseInt(questionCount)} min)
                    </label>
                    <Select value={questionCount} onValueChange={setQuestionCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 questions (5 min)</SelectItem>
                        <SelectItem value="10">10 questions (10 min)</SelectItem>
                        <SelectItem value="15">15 questions (15 min)</SelectItem>
                        <SelectItem value="20">20 questions (20 min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={generateExam}
                    disabled={!selectedSubject || isGenerating}
                    className="w-full bg-green-500 hover:bg-green-600"
                    size="lg"
                  >
                    {isGenerating ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Génération de l'examen...</span>
                      </span>
                    ) : (
                      "🚀 Générer l'examen"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Interface d'examen */}
        {examState.questions.length > 0 && !examState.isCompleted && (
          <div className="max-w-4xl mx-auto">
            {/* Header de l'examen */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {subjects.find(s => s.id === selectedSubject)?.name} - {selectedDifficulty}
                    </h2>
                    <p className="text-gray-600">
                      Question {examState.currentQuestion + 1} sur {examState.questions.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(examState.timeLeft)}
                    </div>
                    <p className="text-sm text-gray-600">Temps restant</p>
                  </div>
                </div>
                <Progress value={progress} className="mt-4" />
              </CardContent>
            </Card>

            {/* Question actuelle */}
            {currentQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {currentQuestion.question}
                  </CardTitle>
                  <Badge className={
                    currentQuestion.difficulty === 'facile' ? 'bg-green-500' :
                    currentQuestion.difficulty === 'moyen' ? 'bg-yellow-500' : 'bg-red-500'
                  }>
                    {currentQuestion.difficulty}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentQuestion.type === 'qcm' && currentQuestion.options && (
                    <RadioGroup
                      value={examState.answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQuestion.type === 'vrai-faux' && (
                    <RadioGroup
                      value={examState.answers[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vrai" id="vrai" />
                        <Label htmlFor="vrai" className="cursor-pointer">Vrai</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="faux" id="faux" />
                        <Label htmlFor="faux" className="cursor-pointer">Faux</Label>
                      </div>
                    </RadioGroup>
                  )}

                  {currentQuestion.type === 'ouverte' && (
                    <Textarea
                      placeholder="Saisissez votre réponse..."
                      value={examState.answers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="min-h-[100px]"
                    />
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <Button 
                      onClick={previousQuestion}
                      disabled={examState.currentQuestion === 0}
                      variant="outline"
                    >
                      ← Précédent
                    </Button>
                    
                    <div className="space-x-2">
                      {examState.currentQuestion === examState.questions.length - 1 ? (
                        <Button onClick={submitExam} className="bg-green-500 hover:bg-green-600">
                          ✅ Terminer l'examen
                        </Button>
                      ) : (
                        <Button onClick={nextQuestion} className="bg-blue-500 hover:bg-blue-600">
                          Suivant →
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Résultats de l'examen */}
        {examState.isCompleted && examState.result && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">
                  {examState.result.percentage >= 80 ? '🎉' : 
                   examState.result.percentage >= 60 ? '👍' : '📚'}
                </div>
                <CardTitle className="text-3xl">
                  {examState.result.percentage >= 80 ? 'Excellent !' :
                   examState.result.percentage >= 60 ? 'Bien joué !' : 'Continuez à étudier !'}
                </CardTitle>
                <CardDescription className="text-xl">
                  Score: {examState.result.score}/{examState.result.maxScore} ({examState.result.percentage}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">💬 Feedback personnalisé:</h3>
                  <p className="text-gray-700">{examState.result.feedback}</p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => setExamState({
                      questions: [],
                      currentQuestion: 0,
                      answers: {},
                      timeLeft: 0,
                      isCompleted: false,
                      result: null
                    })}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    🔄 Nouvel examen
                  </Button>
                  <Link href="/history">
                    <Button variant="outline">
                      📊 Voir l'historique
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}