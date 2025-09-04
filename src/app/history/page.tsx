"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { subjects } from "@/data/subjects";

interface HistoryItem {
  id: string;
  type: 'summary' | 'exam';
  title: string;
  subject: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  createdAt: Date;
  wordCount?: number;
  content?: string;
}

export default function HistoryPage() {
  const [summaries, setSummaries] = useState<HistoryItem[]>([]);
  const [examResults, setExamResults] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger les données depuis localStorage
    const loadedSummaries = JSON.parse(localStorage.getItem('summaries') || '[]').map((s: any) => ({
      ...s,
      type: 'summary',
      createdAt: new Date(s.createdAt)
    }));

    const loadedExamResults = JSON.parse(localStorage.getItem('examResults') || '[]').map((e: any) => ({
      ...e,
      type: 'exam',
      title: `Examen ${subjects.find(s => s.id === e.subject)?.name || 'Inconnu'}`,
      createdAt: new Date(e.completedAt)
    }));

    setSummaries(loadedSummaries);
    setExamResults(loadedExamResults);
    setIsLoading(false);
  }, []);

  const getSubjectIcon = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.icon || '📚';
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Matière inconnue';
  };

  const clearHistory = (type: 'summaries' | 'examResults') => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer tout l'historique des ${type === 'summaries' ? 'résumés' : 'examens'} ?`)) {
      localStorage.removeItem(type);
      if (type === 'summaries') {
        setSummaries([]);
      } else {
        setExamResults([]);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

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
              <Link href="/exams" className="text-gray-600 hover:text-blue-600 transition-colors">
                Examens
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Historique d'Apprentissage
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Consultez tous vos résumés créés et examens passés pour suivre votre progression
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Résumés</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {summaries.length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Examens</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {examResults.length}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Score Moyen</CardDescription>
              <CardTitle className="text-2xl text-purple-600">
                {examResults.length > 0 
                  ? Math.round(examResults.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / examResults.length)
                  : 0}%
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Matières Étudiées</CardDescription>
              <CardTitle className="text-2xl text-amber-600">
                {new Set([...summaries.map(s => s.subject), ...examResults.map(e => e.subject)]).size}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* History Tabs */}
        <Tabs defaultValue="summaries" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summaries" className="flex items-center space-x-2">
              <span>📝</span>
              <span>Résumés ({summaries.length})</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex items-center space-x-2">
              <span>📋</span>
              <span>Examens ({examResults.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Summaries Tab */}
          <TabsContent value="summaries" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Historique des Résumés</h2>
              {summaries.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => clearHistory('summaries')}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  🗑️ Tout effacer
                </Button>
              )}
            </div>

            {summaries.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600 mb-4">Aucun résumé créé pour le moment</p>
                  <Link href="/summaries">
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      Créer votre premier résumé
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summaries.map((summary) => (
                  <Card key={summary.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getSubjectIcon(summary.subject)}</span>
                          <Badge variant="secondary">
                            {getSubjectName(summary.subject)}
                          </Badge>
                        </div>
                        <Badge className="bg-blue-500">
                          {summary.wordCount} mots
                        </Badge>
                      </div>
                      <CardTitle className="text-lg truncate">
                        {summary.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-3">
                        Créé le {formatDate(summary.createdAt)}
                      </CardDescription>
                      {summary.content && (
                        <div className="bg-gray-50 rounded p-3 mb-3 max-h-20 overflow-hidden">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {summary.content.substring(0, 100)}...
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Historique des Examens</h2>
              {examResults.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => clearHistory('examResults')}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  🗑️ Tout effacer
                </Button>
              )}
            </div>

            {examResults.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-600 mb-4">Aucun examen passé pour le moment</p>
                  <Link href="/exams">
                    <Button className="bg-green-500 hover:bg-green-600">
                      Passer votre premier examen
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examResults.map((exam) => (
                  <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getSubjectIcon(exam.subject)}</span>
                          <Badge variant="secondary">
                            {getSubjectName(exam.subject)}
                          </Badge>
                        </div>
                        <Badge className={
                          (exam.percentage || 0) >= 80 ? 'bg-green-500' :
                          (exam.percentage || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          {exam.percentage}%
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {exam.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-3">
                        Passé le {formatDate(exam.createdAt)}
                      </CardDescription>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Score: {exam.score}/{exam.maxScore}
                        </span>
                        <div className={`px-2 py-1 rounded text-xs ${
                          (exam.percentage || 0) >= 80 ? 'bg-green-100 text-green-800' :
                          (exam.percentage || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {(exam.percentage || 0) >= 80 ? '🎉 Excellent' :
                           (exam.percentage || 0) >= 60 ? '👍 Bien' : '📚 À revoir'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        {(summaries.length > 0 || examResults.length > 0) && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle>🚀 Actions rapides</CardTitle>
              <CardDescription>
                Continuez votre apprentissage avec de nouvelles activités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link href="/summaries">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    📝 Nouveau résumé
                  </Button>
                </Link>
                <Link href="/exams">
                  <Button className="bg-green-500 hover:bg-green-600">
                    📋 Nouvel examen
                  </Button>
                </Link>
                <Link href="/subjects">
                  <Button variant="outline">
                    🎯 Explorer les matières
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}