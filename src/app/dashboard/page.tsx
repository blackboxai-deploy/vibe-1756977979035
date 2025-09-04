"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { UserProgress } from "@/types";

export default function DashboardPage() {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    // Simuler le chargement des données utilisateur
    const mockProgress: UserProgress = {
      subjectsStudied: ['math', 'sciences', 'francais'],
      totalSummaries: 12,
      totalExams: 8,
      averageScore: 85,
      lastActivity: new Date(),
      streakDays: 7,
      achievements: ['Premier résumé', 'Examen parfait', 'Semaine studieuse']
    };
    
    setTimeout(() => setUserProgress(mockProgress), 500);
  }, []);

  const quickActions = [
    {
      title: "Générer un résumé",
      description: "Créez un résumé IA de votre cours",
      href: "/summaries",
      icon: "📝",
      color: "bg-blue-500"
    },
    {
      title: "Passer un examen",
      description: "Testez vos connaissances",
      href: "/exams",
      icon: "📋",
      color: "bg-green-500"
    },
    {
      title: "Explorer les matières",
      description: "Découvrez le contenu disponible",
      href: "/subjects",
      icon: "📚",
      color: "bg-purple-500"
    },
    {
      title: "Voir l'historique",
      description: "Consultez vos activités passées",
      href: "/history",
      icon: "📊",
      color: "bg-amber-500"
    }
  ];

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre dashboard...</p>
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
              <Link href="/subjects" className="text-gray-600 hover:text-blue-600 transition-colors">
                Matières
              </Link>
              <Link href="/summaries" className="text-gray-600 hover:text-blue-600 transition-colors">
                Résumés
              </Link>
              <Link href="/exams" className="text-gray-600 hover:text-blue-600 transition-colors">
                Examens
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-blue-600 transition-colors">
                Historique
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bon retour ! 👋
          </h1>
          <p className="text-gray-600">
            Continuez votre parcours d'apprentissage avec EcoLearn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Résumés créés</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {userProgress.totalSummaries}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Examens passés</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {userProgress.totalExams}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Score moyen</CardDescription>
              <CardTitle className="text-2xl text-purple-600">
                {userProgress.averageScore}%
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Série actuelle</CardDescription>
              <CardTitle className="text-2xl text-amber-600">
                {userProgress.streakDays} jours
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Que souhaitez-vous faire aujourd'hui ?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg`}>
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800 mb-1">
                                {action.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress & Achievements */}
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progression générale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Objectif mensuel</span>
                    <span>{userProgress.totalSummaries}/20</span>
                  </div>
                  <Progress value={(userProgress.totalSummaries / 20) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Examens réussis</span>
                    <span>{Math.round(userProgress.averageScore)}%</span>
                  </div>
                  <Progress value={userProgress.averageScore} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Récompenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userProgress.achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="w-full justify-start">
                      🏆 {achievement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Vos dernières sessions d'apprentissage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    📝
                  </div>
                  <div>
                    <p className="font-medium">Résumé de Mathématiques créé</p>
                    <p className="text-sm text-gray-600">Il y a 2 heures</p>
                  </div>
                </div>
                <Badge>Nouveau</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                    📋
                  </div>
                  <div>
                    <p className="font-medium">Examen de Sciences terminé</p>
                    <p className="text-sm text-gray-600">Score: 92% - Hier</p>
                  </div>
                </div>
                <Badge variant="outline">Excellent</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}